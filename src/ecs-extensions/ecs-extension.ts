import { Ec2Service, FargateService, TaskDefinition } from '@aws-cdk/aws-ecs';

/**
 * Rough compatibility interface.
 */
export interface IEcsExtension {
  readonly trafficContainer: string;
  readonly trafficPort: number;
  useTaskDefinition(taskDefinitionInfo: TaskDefinitionBindingInfo): void;
  useService(service: Ec2Service | FargateService): void;
}

/**
 * Provides information to `IEcsExtension.useTaskDefinition` about the task
 * definition.
 */
export interface TaskDefinitionBindingInfo {
  /**
   * The task definition.
   */
  readonly taskDefinition: TaskDefinition;

  /**
   * The memory reservation of the task definition.
   */
  readonly taskMemoryReserved: number;

  /**
   * The memory limit of the task definition.
   */
  readonly taskMemoryLimit: number;
}

/**
 * Provides information to `IEcsExtension.useService` about the service.
 */
export interface ServiceBindingInfo {
  readonly service: Ec2Service | FargateService;
}
