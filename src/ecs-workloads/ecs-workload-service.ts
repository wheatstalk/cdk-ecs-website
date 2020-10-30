import { Ec2Service, FargateService, ICluster, TaskDefinition } from '@aws-cdk/aws-ecs';
import { Construct } from '@aws-cdk/core';

import { IEcsWorkload } from './ecs-workload';
import {
  Ec2WorkloadPattern,
  EcsWorkloadPatternBaseProps,
  FargateWorkloadPattern,
  IEcsWorkloadPattern,
} from './ecs-workload-pattern';

/**
 * Type of capacity to use.
 */
export enum EcsWorkloadCapacityType {
  EC2 = 'ec2',
  FARGATE = 'fargate',
}

/**
 * Props for `EcsWorkloadService`
 * @internal
 */
export interface EcsWorkloadServiceProps extends EcsWorkloadPatternBaseProps {
  readonly cluster: ICluster;
  readonly capacityType?: EcsWorkloadCapacityType;
  readonly serviceExtension: IEcsWorkload;
}

/**
 * Creates an EC2 or Fargate service from an
 * @internal
 */
export class EcsWorkloadService extends Construct {
  /**
   * The instance of the created service.
   */
  public readonly service: Ec2Service | FargateService;

  /**
   * The instance of the created task definition.
   */
  public readonly taskDefinition: TaskDefinition;

  /**
   * Name of the main container.
   */
  public readonly containerName: string;

  /**
   * Traffic port of the main container.
   */
  public readonly trafficPort: number;

  constructor(scope: Construct, id: string, props: EcsWorkloadServiceProps) {
    super(scope, id);

    const servicePattern = getServicePattern(props);

    const { cluster, serviceExtension } = props;
    const taskDefinitionInfo = servicePattern.bindTaskDefinition(this, cluster);

    serviceExtension.useTaskDefinition(taskDefinitionInfo);

    const { service } = servicePattern.bindService(this, cluster, taskDefinitionInfo);

    serviceExtension.useService(service);

    this.taskDefinition = taskDefinitionInfo.taskDefinition;
    this.containerName = serviceExtension.trafficContainer;
    this.trafficPort = serviceExtension.trafficPort;
    this.service = service;
  }
}

/**
 * Gets the appropriate service pattern for the requested capacity type.
 * @internal
 */
function getServicePattern(props: EcsWorkloadServiceProps): IEcsWorkloadPattern {
  const capacityType = props.capacityType ?? EcsWorkloadCapacityType.EC2;

  switch (capacityType) {
    case EcsWorkloadCapacityType.EC2:
      return new Ec2WorkloadPattern(props);
    case EcsWorkloadCapacityType.FARGATE:
      return new FargateWorkloadPattern(props);
    default:
      throw new Error(`unsupported capacity type: ${capacityType}`);
  }
}
