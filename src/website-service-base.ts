import { IConnectable, Port } from '@aws-cdk/aws-ec2';
import { Ec2Service, FargateService, ICluster, TaskDefinition } from '@aws-cdk/aws-ecs';
import { IApplicationListener, RedirectOptions } from '@aws-cdk/aws-elasticloadbalancingv2';
import { Construct } from '@aws-cdk/core';

import { EcsWorkloadCapacityType, EcsWorkloadService, IEcsWorkload } from './ecs-workloads';
import { CognitoAuthenticationConfig, ListenerRulesBuilder } from './listener-rules-builder';
import { ListenerRulePriorities } from './listener-rules-builder/listener-rule-priorities';
import { NginxProxyContainerExtension } from './nginx-proxy-container-extension';

/**
 * A builder-pattern website service.
 */
export interface IWebsiteService {
  /**
   * Add a host name on which traffic will be served.
   */
  addServingHost(hostHeader: string): void;

  /**
   * Add a host name from which traffic will be redirected to another URL.
   */
  addRedirectResponse(hostHeader: string, redirectResponse: RedirectOptions): void;

  /**
   * Add a host name from which traffic will be directed to the primary
   * host name of the `IWebsiteService`.
   */
  addRedirectToPrimaryHostName(hostHeader: string): void;

  // addAuthenticatedServingHost(hostHeader: string, authConfig: AuthWithUserPoolProps): void;
  // addAuthBypassServingHost(hostHeader: string, authBypassValue: string): void;
}

/**
 * Non-workload options for `WebsiteServiceBase`
 */
export interface WebsiteServiceOptions {
  /**
   * The base priority from which to increment rule priorities.
   */
  readonly albBasePriority: number;

  /**
   * The load balancer listener to attach the service to
   */
  readonly albListener: IApplicationListener;

  /**
   * Provide a value that can be used to bypass authentication with headers
   */
  readonly authBypassHeaderValue?: string;

  /**
   * Instruct the service to authenticate with the cognito user pool
   */
  readonly authWithUserPool?: CognitoAuthenticationConfig;

  /**
   * The ECS cluster to add the service to
   */
  readonly cluster: ICluster;

  /**
   * Type of compute capacity.
   * @default EcsExtensionCapacityType.EC2
   */
  readonly capacityType?: EcsWorkloadCapacityType;

  /**
   * Desired task count
   * @default 1
   */
  readonly desiredCount?: number;

  /**
   * The primary host name that this service will serve from and redirect to
   */
  readonly primaryHostName: string;

  /**
   * Allow others access to the traffic port.
   */
  readonly allowedConnections?: IConnectable[];

  /**
   * Register the service as allowed in others' ingresses.
   */
  readonly connectToPeers?: IConnectable[];

  /**
   * Additional host names to serve traffic on.
   */
  readonly additionalServingHosts?: string[];

  /**
   * Redirect listener rules.
   */
  readonly redirects?: WebsiteHostRedirect[];

  /**
   * Provides `default.conf` configuration for an nginx container that is added
   * to the task as the default, traffic-serving container. You may use this
   * feature to create a reverse proxy for your workload.
   * @default - does not use a reverse proxy
   * @experimental
   */
  readonly nginxContainerConfig?: string;

  /**
   * Provides an image name to build the nginx container from. You may change
   * this base image name to 'nginx:1-perl', for instance, if you want perl
   * support in the nginx container config.
   * @default 'nginx:1'
   * @experimental
   */
  readonly nginxContainerImageFrom?: string;
}

/**
 * A redirect.
 */
export interface WebsiteHostRedirect {
  /**
   * Host header to match on
   */
  readonly hostHeader: string;

  /**
   * Details of the redirection. Omit to redirect to the primary host name.
   */
  readonly redirect?: RedirectOptions;
}

/**
 * Props for `WebsiteServiceBase`
 */
export interface WebsiteServiceBaseProps extends WebsiteServiceOptions {
  /**
   * Workload extension.
   */
  readonly ecsExtension: IEcsWorkload;
}

/**
 * Base class for the builder-style website service classes.
 */
export class WebsiteServiceBase extends Construct implements IWebsiteService {
  private listenerRuleBuilder: ListenerRulesBuilder;

  /**
   * The task definition of the service.
   */
  public readonly taskDefinition: TaskDefinition;

  /**
   * The service instance.
   */
  public readonly service: Ec2Service | FargateService;

  constructor(scope: Construct, id: string, props: WebsiteServiceBaseProps) {
    super(scope, id);

    const extensionService = new EcsWorkloadService(this, 'Service', {
      ...props,
      serviceExtension: props.ecsExtension,
    });

    const { taskDefinition, service } = extensionService;

    // When reverse proxy configuration present, we add a reverse proxy container as the default
    // container.
    if (props.nginxContainerConfig) {
      taskDefinition.addExtension(new NginxProxyContainerExtension({
        imageFrom: props.nginxContainerImageFrom,
        defaultConf: props.nginxContainerConfig,
      }));
    }

    const defaultContainerName = taskDefinition.defaultContainer!.containerName;
    const defaultContainerPort = taskDefinition.defaultContainer!.containerPort;

    // Allow the ALB to access the traffic port.
    service.connections.allowFrom(props.albListener, Port.tcp(defaultContainerPort));

    const allowedConnections = props.allowedConnections ?? [];
    for (const connectable of allowedConnections) {
      service.connections.allowFrom(connectable, Port.tcp(defaultContainerPort));
    }

    const connectToPeers = props.connectToPeers ?? [];
    for (const connectToPeer of connectToPeers) {
      connectToPeer.connections.allowFrom(service, Port.allTraffic());
    }

    this.listenerRuleBuilder = new ListenerRulesBuilder(this, 'RulesBuilder', {
      albPriority: ListenerRulePriorities.incremental(props.albBasePriority),
      albListener: props.albListener,
      trafficContainerName: defaultContainerName,
      trafficPort: defaultContainerPort,
      primaryHostName: props.primaryHostName,
      service: service,
    });

    // Add a listener rule for for the primary host name

    if (props.authWithUserPool) {
      if (props.authBypassHeaderValue) {
        // When the user requests authentication, they are allowed to add a
        // special header that lets traffic through.
        this.listenerRuleBuilder.addAuthBypassServingHost(props.primaryHostName, props.authBypassHeaderValue);
      }

      // Add an authenticated serving host.
      this.listenerRuleBuilder.addAuthenticatedServingHost(props.primaryHostName, props.authWithUserPool);
    } else {
      // If no special authentication scheme is requested, we add the primary
      // host name as a serving host.
      this.listenerRuleBuilder.addServingHost(props.primaryHostName);
    }

    // Add additional serving hosts.
    for (const servingHost of props.additionalServingHosts ?? []) {
      this.addServingHost(servingHost);
    }

    // Add any redirects.
    for (const redirect of props.redirects ?? []) {
      if (redirect.redirect) {
        this.addRedirectResponse(redirect.hostHeader, redirect.redirect);
      } else {
        this.addRedirectToPrimaryHostName(redirect.hostHeader);
      }
    }

    this.taskDefinition = taskDefinition;
    this.service = service;
  }

  addRedirectResponse(hostHeader: string, redirectResponse: RedirectOptions): void {
    return this.listenerRuleBuilder.addRedirectResponse(hostHeader, redirectResponse);
  }

  addRedirectToPrimaryHostName(hostHeader: string): void {
    return this.listenerRuleBuilder.addRedirectToPrimaryHostName(hostHeader);
  }

  addServingHost(hostHeader: string): void {
    return this.listenerRuleBuilder.addServingHost(hostHeader);
  }
}

