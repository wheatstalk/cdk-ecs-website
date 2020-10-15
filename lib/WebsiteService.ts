import { CfnUserPoolClient, IUserPool, OAuthScope, UserPoolClient } from '@aws-cdk/aws-cognito';
import { IVpc } from '@aws-cdk/aws-ec2';
import {
  Compatibility,
  ContainerImage,
  Ec2Service,
  ICluster,
  LogDriver,
  Secret,
  TaskDefinition,
} from '@aws-cdk/aws-ecs';
import {
  ApplicationListenerRule,
  ApplicationProtocol,
  ApplicationTargetGroup,
  CfnListener,
  CfnListenerRule,
  IApplicationListener,
  IApplicationTargetGroup,
  Protocol
} from '@aws-cdk/aws-elasticloadbalancingv2';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { Construct, Duration } from '@aws-cdk/core';

import { NumberSequence } from './NumberSequence';
import { ServingActionsBuilder, UserPoolInfo } from './ServingActionsBuilder';

/**
 * Maps a host name which would be used to a host header to a string that
 * will work in a construct name.
 *
 * @param hostHeader
 */
export const mapHostToConstructName = (hostHeader: string): string => hostHeader
  .toLowerCase()
  .replace('*', 'wildcard')
  .replace(/[^a-z0-9-]/g, '');

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

export interface WebsiteServicePropsAuthWithUserPoolProps {
  domain: string;
  userPool: IUserPool;
}

export interface WebsiteServiceProps {
  /** The base priority from which to increment rule priorities. */
  albBasePriority: number;
  /** The load balancer listener to attach the service to */
  albListener: IApplicationListener;
  /** Provide a value that can be used to bypass authentication with headers */
  authBypassHeaderValue?: string;
  /** Instruct the service to authenticate with the cognito user pool */
  authWithUserPool?: WebsiteServicePropsAuthWithUserPoolProps;
  /** The ECS cluster to add the service to */
  cluster: ICluster;
  /** The main container image */
  containerImage: ContainerImage;
  /** The the main container port to expose by load balancer. Default 80 */
  containerPort?: number;
  /** Desired task count */
  desiredCount?: number;
  /** Specify environment variables for the main container */
  envVars?: { [x: string]: string };
  /** Specify environment variables from secrets for the main container */
  envSecrets?: { [x: string]: Secret };
  /** The primary host name that this service will serve from and redirect to */
  primaryHostName: string;
}

/**
 * Creates a website service on ECS.
 */
export class WebsiteService extends Construct {
  private albPriority: NumberSequence;
  private albListener: IApplicationListener;
  private readonly clusterVpc: IVpc;
  private containerPort: number;
  private hostName: string;
  public readonly taskDefinition: TaskDefinition;
  public readonly service: Ec2Service;
  private targetGroup?: IApplicationTargetGroup;
  private servingActions: CfnListener.ActionProperty[];
  private authBypassValue?: string;

  constructor(scope: Construct, id: string, props: WebsiteServiceProps) {
    super(scope, id);

    this.containerPort = props.containerPort || 80;
    this.albPriority = new NumberSequence(props.albBasePriority);
    this.albListener = props.albListener;
    this.clusterVpc = props.cluster.vpc;
    this.hostName = props.primaryHostName;

    this.taskDefinition = new TaskDefinition(this, 'Task', {
      compatibility: Compatibility.EC2,
    });

    const container = this.taskDefinition.addContainer('web', {
      image: props.containerImage,
      memoryReservationMiB: 64,
      memoryLimitMiB: 512,
      logging: LogDriver.awsLogs({
        streamPrefix: 'web',
        logRetention: RetentionDays.ONE_MONTH,
      }),
      environment: props.envVars || {},
      secrets: props.envSecrets || {},
    });

    container.addPortMappings({
      containerPort: this.containerPort,
      hostPort: 0,
    });

    this.service = new Ec2Service(this, 'Service', {
      cluster: props.cluster,
      desiredCount: props.desiredCount,
      healthCheckGracePeriod: Duration.seconds(30),
      taskDefinition: this.taskDefinition,
    });

    // When authentication is enabled and a bypass header value is available,
    // we accept the authBypassHeaderValue.
    if (props.authWithUserPool && props.authBypassHeaderValue) {
      this.authBypassValue = props.authBypassHeaderValue;
    }

    // Generate the serving actions.
    const servingActionsBuilder = new ServingActionsBuilder(this.obtainTargetGroup());
    servingActionsBuilder.userPoolInfo = this.obtainUserPoolInfo(props);
    this.servingActions = servingActionsBuilder.build();

    // Add the primary host name as a serving host.
    this.addServingHost(props.primaryHostName);
  }

  private obtainUserPoolInfo(props: WebsiteServiceProps): UserPoolInfo | undefined {
    if (!props.authWithUserPool) return undefined;

    // Create a user pool client and associate it with the user pool.
    const userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      authFlows: {
        userPassword: true,
      },
      generateSecret: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [
          OAuthScope.PROFILE,
          OAuthScope.COGNITO_ADMIN,
          OAuthScope.OPENID,
          OAuthScope.EMAIL,
          OAuthScope.PHONE,
        ],
        callbackUrls: [
          // Application load balancer handles the idp response on a specific
          // callback uri: /oauth2/idpresponse
          `https://${props.primaryHostName}/oauth2/idpresponse`,
        ],
      },
      userPool: props.authWithUserPool.userPool,
    });

    // Hack in COGNITO as a supported identity provider.
    const cfnUserPoolClient = userPoolClient.node.defaultChild as unknown as CfnUserPoolClient;
    cfnUserPoolClient.supportedIdentityProviders = ['COGNITO'];

    return {
      userPool: props.authWithUserPool.userPool,
      userPoolClient: userPoolClient,
      domain: props.authWithUserPool.domain,
    };
  }

  public obtainTargetGroup(): IApplicationTargetGroup {
    // Create a target group if we don't have one.
    if (!this.targetGroup) {
      this.targetGroup = new ApplicationTargetGroup(this, 'TargetGroup', {
        deregistrationDelay: Duration.seconds(15),
        protocol: ApplicationProtocol.HTTP,
        port: this.containerPort,
        vpc: this.clusterVpc,
        healthCheck: {
          enabled: true,
          protocol: Protocol.HTTP,
          interval: Duration.seconds(15),
          healthyThresholdCount: 5,
          unhealthyThresholdCount: 2,
          timeout: Duration.seconds(5),
        },
      });
      this.service.attachToApplicationTargetGroup(this.targetGroup);
    }

    return this.targetGroup;
  }

  public addServingHost(hostHeader: string): void {
    // When an authBypassHeaderValue is available, add it first.
    if (this.authBypassValue) {
      this.createAuthBypassHeaderListenerRule(hostHeader);
    }

    this.createHostHeaderListenerRule(hostHeader);
  }

  private createHostHeaderListenerRule(hostHeader: string): void {
    new CfnListenerRule(this, 'Target-' + mapHostToConstructName(hostHeader), {
      actions: this.servingActions,
      conditions: [
        {
          field: 'host-header',
          values: [hostHeader],
        },
      ],
      listenerArn: this.albListener.listenerArn,
      priority: this.albPriority.getNextAndIncrement(),
    });
  }

  private createAuthBypassHeaderListenerRule(hostHeader: string): void {
    if (!this.authBypassValue) throw new Error('Can\'t create an auth bypass rule because no auth bypass value is available');

    new CfnListenerRule(this, 'TargetAuthBypass-' + mapHostToConstructName(hostHeader), {
      actions: [
        {
          type: 'forward',
          targetGroupArn: this.obtainTargetGroup().targetGroupArn,
        },
      ],
      conditions: [
        {
          field: 'http-header',
          httpHeaderConfig: {
            httpHeaderName: 'AccessBypass',
            values: [this.authBypassValue],
          },
        },
        {
          field: 'host-header',
          values: [hostHeader],
        },
      ],
      listenerArn: this.albListener.listenerArn,
      priority: this.albPriority.getNextAndIncrement(),
    });
  }

  public addRedirectResponse(hostHeader: string, redirectResponse: DefaultingRedirectResponse): void {
    new ApplicationListenerRule(this, 'Target-' + mapHostToConstructName(hostHeader), {
      hostHeader: hostHeader,
      listener: this.albListener,
      priority: this.albPriority.getNextAndIncrement(),
      redirectResponse: {
        host: redirectResponse.host ?? this.hostName,
        path: redirectResponse.path ?? '/#{path}',
        port: redirectResponse.port ?? '#{port}',
        protocol: redirectResponse.protocol ?? '#{protocol}',
        query: redirectResponse.query ?? '#{query}',
        statusCode: redirectResponse.statusCode ?? RedirectResponseStatus.HTTP_301_PERMANENT,
      }
    });
  }

  public addRedirectToPrimaryHostName(hostHeader: string): void {
    this.addRedirectResponse(hostHeader, {
      host: this.hostName,
    });
  }
}