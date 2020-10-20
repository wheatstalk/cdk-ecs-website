import {
  Ec2Service,
  Ec2TaskDefinition,
  FargatePlatformVersion,
  FargateService,
  FargateTaskDefinition,
  ICluster,
  NetworkMode,
} from '@aws-cdk/aws-ecs';
import { Construct } from '@aws-cdk/core';

import { EcsWorkloadServiceInfo, EcsWorkloadTaskInfo } from './ecs-workload';
import { findSmallestPublishedFargateSpec } from './fargate-spec-finder';

/**
 * Props for `EcsServicePatternBase`
 * @internal
 */
export interface EcsWorkloadPatternBaseProps {
  /**
   * Desired number of tasks.
   * @default 1
   */
  readonly desiredCount?: number;

  /**
   * Minimum cpu required. (Fargate size)
   * @default no reservation
   */
  readonly cpuMinimum?: number;

  /**
   * Memory reservation required to schedule.
   * @default 64
   */
  readonly memoryReserved?: number;

  /**
   * Maximum memory allowed before task is killed.
   * @default 512
   */
  readonly memoryLimit?: number;

  /**
   * Requested network mode
   * @default When ec2, BRIDGED, otherwise AWS_VPC
   */
  readonly networkMode?: NetworkMode;
}

/**
 * Interface for the pattern of creating ECS task definitions and services.
 * @internal
 */
export interface IEcsWorkloadPattern {
  bindTaskDefinition(scope: Construct, cluster: ICluster): EcsWorkloadTaskInfo;

  bindService(
    scope: Construct,
    cluster: ICluster,
    taskDefinitionBinding: EcsWorkloadTaskInfo,
  ): EcsWorkloadServiceInfo;
}

/**
 * Base class for creating task definitions and services.
 * @internal
 */
export abstract class EcsWorkloadPatternBase {
  protected readonly cpuMinimum: number;
  protected readonly memoryReserved: number;
  protected readonly memoryLimit: number;
  protected readonly desiredCount: number;

  protected constructor(props: EcsWorkloadPatternBaseProps) {
    this.cpuMinimum = props.cpuMinimum ?? 0;
    this.memoryReserved = props.memoryReserved ?? 64;
    this.memoryLimit = props.memoryLimit ?? 512;
    this.desiredCount = props.desiredCount ?? 1;
  }
}

/**
 * Props for `Ec2WorkloadPattern`
 * @internal
 */
export interface Ec2WorkloadPatternProps extends EcsWorkloadPatternBaseProps {
}

/**
 * Creates an EC2 task definition and service.
 * @internal
 */
export class Ec2WorkloadPattern extends EcsWorkloadPatternBase implements IEcsWorkloadPattern {
  protected readonly networkMode: NetworkMode;

  constructor(props: Ec2WorkloadPatternProps) {
    super(props);
    this.networkMode = props.networkMode ?? NetworkMode.BRIDGE;
  }

  bindTaskDefinition(scope: Construct, _cluster: ICluster): EcsWorkloadTaskInfo {
    const taskDefinition = new Ec2TaskDefinition(scope, 'Task', {
      networkMode: this.networkMode,
    });

    return {
      taskDefinition: taskDefinition,
      taskMemoryReserved: this.memoryReserved,
      taskMemoryLimit: this.memoryLimit,
    };
  }

  bindService(
    scope: Construct,
    cluster: ICluster,
    taskDefinitionBinding: EcsWorkloadTaskInfo,
  ): EcsWorkloadServiceInfo {
    const service = new Ec2Service(scope, 'Service', {
      cluster: cluster,
      taskDefinition: taskDefinitionBinding.taskDefinition,
      desiredCount: this.desiredCount,
    });

    return {
      service,
    };
  }
}

/**
 * Props for `FargateWorkloadPattern`
 * @internal
 */
export interface FargateWorkloadPatternProps extends EcsWorkloadPatternBaseProps {
}

/**
 * Creates fargate task definitions and services.
 * @internal
 */
export class FargateWorkloadPattern extends EcsWorkloadPatternBase implements IEcsWorkloadPattern {
  constructor(props: FargateWorkloadPatternProps) {
    super(props);
  }

  bindTaskDefinition(scope: Construct, _cluster: ICluster): EcsWorkloadTaskInfo {
    const fargateSpec = findSmallestPublishedFargateSpec(this.cpuMinimum, this.memoryLimit);

    const taskDefinition = new FargateTaskDefinition(scope, 'Task', {
      ...fargateSpec,
    });

    return {
      taskDefinition: taskDefinition,
      taskMemoryLimit: fargateSpec.memory,
      taskMemoryReserved: fargateSpec.memory,
    };
  }

  bindService(
    scope: Construct,
    cluster: ICluster,
    taskDefinitionBinding: EcsWorkloadTaskInfo,
  ): EcsWorkloadServiceInfo {
    const service = new FargateService(scope, 'Service', {
      cluster: cluster,
      taskDefinition: taskDefinitionBinding.taskDefinition,
      desiredCount: this.desiredCount,
      platformVersion: FargatePlatformVersion.VERSION1_4,
    });

    return {
      service,
    };
  }
}
