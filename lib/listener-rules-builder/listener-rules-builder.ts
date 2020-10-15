import { CfnUserPoolClient, IUserPool, OAuthScope, UserPoolClient } from '@aws-cdk/aws-cognito';
import { IVpc } from '@aws-cdk/aws-ec2';
import { Ec2Service, FargateService, ICluster } from '@aws-cdk/aws-ecs';
import {
  ApplicationListenerRule,
  ApplicationProtocol,
  ApplicationTargetGroup,
  IApplicationListener,
  IApplicationTargetGroup,
  ListenerAction,
  ListenerCondition,
  Protocol,
} from '@aws-cdk/aws-elasticloadbalancingv2';
import { Construct, Duration } from '@aws-cdk/core';

import { CognitoAuthenticateAction, CognitoAuthenticateOptions } from './cognito-authenticate-action';
import { NumberSequence } from './number-sequence';

export interface AuthWithUserPoolProps {
  domain: string;
  userPool: IUserPool;
}

export enum RedirectResponseStatus {
  HTTP_301_PERMANENT = 'HTTP_301',
  HTTP_302_FOUND = 'HTTP_302',
}

export interface DefaultingRedirectResponse {
  host?: string;
  path?: string;
  port?: string;
  protocol?: string;
  query?: string;
  statusCode?: RedirectResponseStatus;
}

/**
 * Maps a host name which would be used to a host header to a string that
 * will work in a construct name.
 *
 * @param hostHeader
 */
export const mapHostToConstructName = (hostHeader: string): string =>
  hostHeader
    .toLowerCase()
    .replace('*', 'wildcard')
    .replace(/[^a-z0-9-]/g, '');

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ListenerRulesBuilder {
  addServingHost(hostHeader: string): void;

  addRedirectResponse(hostHeader: string, redirectResponse: DefaultingRedirectResponse): void;

  addRedirectToPrimaryHostName(hostHeader: string): void;

  // addAuthenticatedServingHost(hostHeader: string, authConfig: AuthWithUserPoolProps): void;
  // addAuthBypassServingHost(hostHeader: string, authBypassValue: string): void;
}

export interface ListenerRulesBuilderProps {
  service: Ec2Service | FargateService;
  cluster: ICluster;
  albBasePriority: number;
  albListener: IApplicationListener;
  containerName: string;
  trafficPort: number;
  primaryHostName: string;
  authWithUserPool?: AuthWithUserPoolProps;
}

/**
 * Creates a website service on ECS.
 */
export class ListenerRulesBuilderImpl extends Construct implements ListenerRulesBuilder {
  private readonly albPriority: NumberSequence;
  private readonly albListener: IApplicationListener;
  private readonly clusterVpc: IVpc;

  private readonly containerName: string;
  private readonly containerPort: number;
  private readonly primaryHostName: string;

  private readonly cluster: ICluster;

  private readonly service: Ec2Service | FargateService;
  private readonly deregistrationDelay: Duration;

  constructor(scope: Construct, id: string, props: ListenerRulesBuilderProps) {
    super(scope, id);

    this.containerName = props.containerName;
    this.containerPort = props.trafficPort;
    this.albListener = props.albListener;
    this.cluster = props.cluster;
    this.primaryHostName = props.primaryHostName;
    this.clusterVpc = this.cluster.vpc;
    this.albPriority = new NumberSequence(props.albBasePriority);
    this.service = props.service;
    this.deregistrationDelay = Duration.seconds(15);
  }

  private obtainUserPoolInfo(config: AuthWithUserPoolProps): CognitoAuthenticateOptions {
    const name = `UserPoolClient-${mapHostToConstructName(config.domain)}`;
    // Create a user pool client and associate it with the user pool.
    const userPoolClient =
      (this.node.tryFindChild(name) as UserPoolClient) ??
      new UserPoolClient(this, name, {
        authFlows: {
          userPassword: true,
        },
        generateSecret: true,
        oAuth: {
          flows: {
            authorizationCodeGrant: true,
          },
          scopes: [OAuthScope.PROFILE, OAuthScope.COGNITO_ADMIN, OAuthScope.OPENID, OAuthScope.EMAIL, OAuthScope.PHONE],
          callbackUrls: [
            // Application load balancer handles the idp response on a specific
            // callback uri: /oauth2/idpresponse
            `https://${this.primaryHostName}/oauth2/idpresponse`,
          ],
        },
        userPool: config.userPool,
      });

    // Hack in COGNITO as a supported identity provider.
    const cfnUserPoolClient = (userPoolClient.node.defaultChild as unknown) as CfnUserPoolClient;
    cfnUserPoolClient.supportedIdentityProviders = ['COGNITO'];

    return {
      userPool: config.userPool,
      userPoolClient: userPoolClient,
      domain: config.domain,
    };
  }

  private obtainTargetGroup(): IApplicationTargetGroup {
    const existingTargetGroup = this.node.tryFindChild('TargetGroup') as ApplicationTargetGroup;
    return (
      existingTargetGroup ??
      new ApplicationTargetGroup(this, 'TargetGroup', {
        deregistrationDelay: this.deregistrationDelay,
        protocol: ApplicationProtocol.HTTP,
        vpc: this.clusterVpc,
        targets: [
          this.service.loadBalancerTarget({
            containerName: this.containerName,
            containerPort: this.containerPort,
          }),
        ],
        healthCheck: {
          enabled: true,
          protocol: Protocol.HTTP,
          interval: Duration.seconds(15),
          healthyThresholdCount: 5,
          unhealthyThresholdCount: 2,
          timeout: Duration.seconds(5),
        },
      })
    );
  }

  public addServingHost(hostHeader: string): void {
    const priority = this.albPriority.getNextAndIncrement();
    const id = 'Target-' + mapHostToConstructName(hostHeader);

    new ApplicationListenerRule(this, id, {
      listener: this.albListener,
      conditions: [ListenerCondition.hostHeaders([hostHeader])],
      action: ListenerAction.forward([this.obtainTargetGroup()]),
      priority: priority,
    });
  }

  public addAuthenticatedServingHost(hostHeader: string, authConfig: AuthWithUserPoolProps): void {
    const targetGroup = this.obtainTargetGroup();
    const userPoolInfo = this.obtainUserPoolInfo(authConfig);
    const priority = this.albPriority.getNextAndIncrement();

    new ApplicationListenerRule(this, 'AuthedTarget-' + mapHostToConstructName(hostHeader), {
      listener: this.albListener,
      conditions: [ListenerCondition.hostHeaders([hostHeader])],
      action: new CognitoAuthenticateAction(userPoolInfo, ListenerAction.forward([targetGroup])),
      priority: priority,
    });
  }

  public addAuthBypassServingHost(hostHeader: string, authBypassValue: string): void {
    const priority = this.albPriority.getNextAndIncrement();

    new ApplicationListenerRule(this, 'TargetAuthBypass-' + mapHostToConstructName(hostHeader), {
      listener: this.albListener,
      conditions: [
        ListenerCondition.httpHeader('AccessBypass', [authBypassValue]),
        ListenerCondition.hostHeaders([hostHeader]),
      ],
      action: ListenerAction.forward([this.obtainTargetGroup()]),
      priority: priority,
    });
  }

  public addRedirectResponse(hostHeader: string, redirectResponse: DefaultingRedirectResponse): void {
    const priority = this.albPriority.getNextAndIncrement();

    new ApplicationListenerRule(this, 'Target-' + mapHostToConstructName(hostHeader), {
      hostHeader: hostHeader,
      listener: this.albListener,
      priority: priority,
      redirectResponse: {
        host: redirectResponse.host,
        path: redirectResponse.path ?? '/#{path}',
        port: redirectResponse.port ?? '#{port}',
        protocol: redirectResponse.protocol ?? '#{protocol}',
        query: redirectResponse.query ?? '#{query}',
        statusCode: redirectResponse.statusCode ?? RedirectResponseStatus.HTTP_301_PERMANENT,
      },
    });
  }

  public addRedirectToPrimaryHostName(hostHeader: string): void {
    this.addRedirectResponse(hostHeader, {
      host: this.primaryHostName,
    });
  }
}
