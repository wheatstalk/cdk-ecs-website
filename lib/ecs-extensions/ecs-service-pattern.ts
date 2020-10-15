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

import { ServiceBindingInfo, TaskDefinitionBindingInfo } from './ecs-extension';
import { findSmallestPublishedFargateSpec } from './fargate-spec-finder';

export interface EcsServicePattern {
  bindTaskDefinition(scope: Construct, cluster: ICluster): TaskDefinitionBindingInfo;

  bindService(
    scope: Construct,
    cluster: ICluster,
    taskDefinitionBinding: TaskDefinitionBindingInfo,
  ): ServiceBindingInfo;
}

export interface EcsServicePatternBaseProps {
  /**
   * Desired number of tasks.
   * @default 1
   */
  desiredCount?: number;

  /**
   * Minimum cpu required. (Fargate size)
   * @default no reservation
   */
  cpuMinimum?: number;

  /**
   * Memory reservation required to schedule.
   * @default 64
   */
  memoryReserved?: number;

  /**
   * Maximum memory allowed before task is killed.
   * @default 512
   */
  memoryLimit?: number;

  /**
   * Requested network mode
   * @default When ec2, BRIDGED, otherwise AWS_VPC
   */
  networkMode?: NetworkMode;
}

export abstract class EcsServicePatternBase {
  protected readonly cpuMinimum: number;
  protected readonly memoryReserved: number;
  protected readonly memoryLimit: number;
  protected readonly desiredCount: number;

  protected constructor(props: EcsServicePatternBaseProps) {
    this.cpuMinimum = props.cpuMinimum ?? 0;
    this.memoryReserved = props.memoryReserved ?? 64;
    this.memoryLimit = props.memoryLimit ?? 512;
    this.desiredCount = props.desiredCount ?? 1;
  }
}

export interface Ec2ServicePatternProps extends EcsServicePatternBaseProps {}

export class Ec2ServicePattern extends EcsServicePatternBase implements EcsServicePattern {
  protected readonly networkMode: NetworkMode;

  constructor(props: Ec2ServicePatternProps) {
    super(props);
    this.networkMode = props.networkMode ?? NetworkMode.BRIDGE;
  }

  bindTaskDefinition(scope: Construct, _cluster: ICluster): TaskDefinitionBindingInfo {
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
    taskDefinitionBinding: TaskDefinitionBindingInfo,
  ): ServiceBindingInfo {
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

export interface FargateServicePatternProps extends EcsServicePatternBaseProps {}

export class FargateServicePattern extends EcsServicePatternBase implements EcsServicePattern {
  constructor(props: FargateServicePatternProps) {
    super(props);
  }

  bindTaskDefinition(scope: Construct, _cluster: ICluster): TaskDefinitionBindingInfo {
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
    taskDefinitionBinding: TaskDefinitionBindingInfo,
  ): ServiceBindingInfo {
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
