import { ContainerImage, Ec2Service, FargateService, LogDriver, Secret } from '@aws-cdk/aws-ecs';
import { RetentionDays } from '@aws-cdk/aws-logs';

import { EcsExtension, TaskDefinitionBindingInfo } from '../ecs-extensions';

export interface HttpContainerExtensionProps {
  /**
   * The container image.
   */
  containerImage: ContainerImage;

  /**
   * The port that serves traffic
   * @default 80
   */
  trafficPort?: number;

  /**
   * Specify environment variables for the main container.
   */
  envVars?: Record<string, string>;

  /**
   * Specify environment variables from secrets for the main container.
   */
  envSecrets?: Record<string, Secret>;
}

export class HttpContainerExtension implements EcsExtension {
  private readonly trafficPort: number;

  constructor(private readonly props: HttpContainerExtensionProps) {
    this.trafficPort = props.trafficPort ?? 80;
  }

  getTrafficContainer(): string {
    return 'web';
  }

  getTrafficPort(): number {
    return this.trafficPort;
  }

  useTaskDefinition(taskDefinitionInfo: TaskDefinitionBindingInfo): void {
    const { taskDefinition } = taskDefinitionInfo;
    const props = this.props;

    const containerName = this.getTrafficContainer();
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
