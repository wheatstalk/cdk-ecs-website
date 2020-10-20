import { IConnectable, Port } from '@aws-cdk/aws-ec2';
import { ICluster } from '@aws-cdk/aws-ecs';
import { IApplicationListener } from '@aws-cdk/aws-elasticloadbalancingv2';
import { Construct } from '@aws-cdk/core';

import { IEcsExtension, EcsExtensionServiceCapacityType, EcsExtensionService } from './ecs-extensions';
import {
  AuthWithUserPoolProps,
  DefaultingRedirectResponse,
  IWebsiteService,
  ListenerRulesBuilder,
} from './listener-rules-builder';

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
  readonly authWithUserPool?: AuthWithUserPoolProps;

  /**
   * The ECS cluster to add the service to
   */
  readonly cluster: ICluster;

  /**
   * Type of compute capacity.
   * @default EcsExtensionCapacityType.EC2
   */
  readonly capacityType?: EcsExtensionServiceCapacityType;

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
}

/**
 * Props for `WebsiteServiceBase`
 */
export interface WebsiteServiceBaseProps extends WebsiteServiceOptions {
  /**
   * Workload extension.
   */
  readonly ecsExtension: IEcsExtension;
}

/**
 * Base class for the builder-style website service classes.
 */
export class WebsiteServiceBase extends Construct implements IWebsiteService {
  private listenerRuleBuilder: ListenerRulesBuilder;

  constructor(scope: Construct, id: string, props: WebsiteServiceBaseProps) {
    super(scope, id);

    const extensionService = new EcsExtensionService(this, 'Service', {
      ...props,
      capacityType: EcsExtensionServiceCapacityType.EC2,
      serviceExtension: props.ecsExtension,
    });

    const { service, containerName, trafficPort } = extensionService;

    // Allow the ALB to access the traffic port.
    service.connections.allowFrom(props.albListener, Port.tcp(trafficPort));

    const allowedConnections = props.allowedConnections ?? [];
    for (const connectable of allowedConnections) {
      service.connections.allowFrom(connectable, Port.tcp(trafficPort));
    }

    const connectToPeers = props.connectToPeers ?? [];
    for (const connectToPeer of connectToPeers) {
      connectToPeer.connections.allowFrom(service, Port.allTraffic());
    }

    this.listenerRuleBuilder = new ListenerRulesBuilder(this, 'RulesBuilder', {
      albBasePriority: props.albBasePriority,
      albListener: props.albListener,
      cluster: props.cluster,
      containerName: containerName,
      trafficPort: trafficPort,
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
  }

  addRedirectResponse(hostHeader: string, redirectResponse: DefaultingRedirectResponse): void {
    return this.listenerRuleBuilder.addRedirectResponse(hostHeader, redirectResponse);
  }

  addRedirectToPrimaryHostName(hostHeader: string): void {
    return this.listenerRuleBuilder.addRedirectToPrimaryHostName(hostHeader);
  }

  addServingHost(hostHeader: string): void {
    return this.listenerRuleBuilder.addServingHost(hostHeader);
  }
}
