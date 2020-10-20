import { ContainerImage, Ec2Service, FargateService, LogDriver, Secret } from '@aws-cdk/aws-ecs';
import { RetentionDays } from '@aws-cdk/aws-logs';

import { IEcsExtension, TaskDefinitionBindingInfo } from '../ecs-extensions';

/**
 * Props for `HttpContainerExtension`
 */
export interface HttpContainerExtensionProps {
  /**
   * The container image.
   */
  readonly containerImage: ContainerImage;

  /**
   * The port that serves traffic
   * @default 80
   */
  readonly trafficPort?: number;

  /**
   * Specify environment variables for the main container.
   */
  readonly envVars?: Record<string, string>;

  /**
   * Specify environment variables from secrets for the main container.
   */
  readonly envSecrets?: Record<string, Secret>;
}

/**
 * Provides a simple HTTP-serving container as a service workload.
 */
export class HttpContainerExtension implements IEcsExtension {
  public readonly trafficContainer = 'web';
  public readonly trafficPort: number;

  constructor(private readonly props: HttpContainerExtensionProps) {
    this.trafficPort = props.trafficPort ?? 80;
  }

  useTaskDefinition(taskDefinitionInfo: TaskDefinitionBindingInfo): void {
    const { taskDefinition } = taskDefinitionInfo;
    const props = this.props;

    const containerName = this.trafficContainer;
    const container = taskDefinition.addContainer(containerName, {
      image: props.containerImage,
      memoryReservationMiB: taskDefinitionInfo.taskMemoryReserved,
      memoryLimitMiB: taskDefinitionInfo.taskMemoryLimit,
      logging: LogDriver.awsLogs({
        streamPrefix: 'HttpContainerExtension',
        logRetention: RetentionDays.ONE_MONTH,
      }),
      environment: props.envVars,
      secrets: props.envSecrets,
    });

    container.addPortMappings({
      containerPort: this.trafficPort,
    });
  }

  useService(_service: Ec2Service | FargateService): void {
    return;
  }
}
