import { Ec2Service, FargateService, ICluster } from '@aws-cdk/aws-ecs';
import { Construct } from '@aws-cdk/core';

import { IEcsExtension } from './ecs-extension';
import {
  Ec2ServicePattern,
  EcsServicePatternBaseProps,
  FargateServicePattern,
  IEcsServicePattern,
} from './ecs-service-pattern';

/**
 * Type of capacity to use.
 */
export enum EcsExtensionServiceCapacityType {
  EC2 = 'ec2',
  FARGATE = 'fargate',
}

/**
 * Props for `EcsExtensionService`
 */
export interface EcsExtensionServiceProps extends EcsServicePatternBaseProps {
  readonly cluster: ICluster;
  readonly capacityType?: EcsExtensionServiceCapacityType;
  readonly serviceExtension: IEcsExtension;
}

/**
 * Creates an EC2 or Fargate service from an `IEcsExtension`.
 */
export class EcsExtensionService extends Construct {
  public service: Ec2Service | FargateService;
  public containerName: string;
  public trafficPort: number;

  constructor(scope: Construct, id: string, props: EcsExtensionServiceProps) {
    super(scope, id);

    const servicePattern = getServicePattern(props);

    const { cluster, serviceExtension } = props;
    const taskDefinitionInfo = servicePattern.bindTaskDefinition(this, cluster);

    serviceExtension.useTaskDefinition(taskDefinitionInfo);

    const { service } = servicePattern.bindService(this, cluster, taskDefinitionInfo);

    serviceExtension.useService(service);

    this.containerName = serviceExtension.trafficContainer;
    this.trafficPort = serviceExtension.trafficPort;
    this.service = service;
  }
}

/**
 * Gets the appropriate service pattern for the requested capacity type.
 * @internal
 */
function getServicePattern(props: EcsExtensionServiceProps): IEcsServicePattern {
  const capacityType = props.capacityType ?? EcsExtensionServiceCapacityType.EC2;

  let ec2ServicePattern;
  switch (capacityType) {
    case EcsExtensionServiceCapacityType.EC2:
      ec2ServicePattern = new Ec2ServicePattern(props);
      return ec2ServicePattern;
    case EcsExtensionServiceCapacityType.FARGATE:
      return new FargateServicePattern(props);
    default:
      throw new Error(`unsupported capacity type: ${capacityType}`);
  }
}
