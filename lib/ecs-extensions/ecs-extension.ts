import { Ec2Service, FargateService, TaskDefinition } from '@aws-cdk/aws-ecs';

export interface EcsExtension {
  useTaskDefinition(taskDefinitionInfo: TaskDefinitionBindingInfo): void;
  useService(service: Ec2Service | FargateService): void;
  getTrafficContainer(): string;
  getTrafficPort(): number;
}

export interface TaskDefinitionBindingInfo {
  taskDefinition: TaskDefinition;
  taskMemoryReserved: number;
  taskMemoryLimit: number;
}

export interface ServiceBindingInfo {
  service: Ec2Service | FargateService;
}
