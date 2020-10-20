import { Ec2Service, FargateService, TaskDefinition } from '@aws-cdk/aws-ecs';

/**
 * Rough compatibility interface.
 * @internal
 */
export interface IEcsWorkload {
  readonly trafficContainer: string;
  readonly trafficPort: number;
  useTaskDefinition(taskDefinitionInfo: EcsWorkloadTaskInfo): void;
  useService(service: Ec2Service | FargateService): void;
}

/**
 * Provides information to `IEcsWorkload.useTaskDefinition` about the task
 * definition.
 * @internal
 */
export interface EcsWorkloadTaskInfo {
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
 * Provides information to `IEcsWorkload.useService` about the service.
 * @internal
 */
export interface EcsWorkloadServiceInfo {
  readonly service: Ec2Service | FargateService;
}
