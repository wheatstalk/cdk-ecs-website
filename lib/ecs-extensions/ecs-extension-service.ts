import { Ec2Service, FargateService, ICluster } from '@aws-cdk/aws-ecs';
import { Construct } from '@aws-cdk/core';

import { EcsExtension } from './ecs-extension';
import {
  Ec2ServicePattern,
  EcsServicePattern,
  EcsServicePatternBaseProps,
  FargateServicePattern,
} from './ecs-service-pattern';

export enum EcsExtensionCapacityType {
  EC2 = 'ec2',
  FARGATE = 'fargate',
}

export interface EcsExtensionServiceProps extends EcsServicePatternBaseProps {
  cluster: ICluster;
  capacityType?: EcsExtensionCapacityType;
  serviceExtension: EcsExtension;
}

export class EcsExtensionService extends Construct {
  public service: Ec2Service | FargateService;
  public containerName: string;
  public trafficPort: number;

  constructor(scope: Construct, id: string, props: EcsExtensionServiceProps) {
    super(scope, id);

    const servicePattern = this.getServicePattern(props);

    const { cluster, serviceExtension } = props;
    const taskDefinitionInfo = servicePattern.bindTaskDefinition(this, cluster);

    serviceExtension.useTaskDefinition(taskDefinitionInfo);

    const { service } = servicePattern.bindService(this, cluster, taskDefinitionInfo);

    serviceExtension.useService(service);

    this.containerName = serviceExtension.getTrafficContainer();
    this.trafficPort = serviceExtension.getTrafficPort();
    this.service = service;
  }

  getServicePattern(props: EcsExtensionServiceProps): EcsServicePattern {
    const capacityType = props.capacityType ?? EcsExtensionCapacityType.EC2;

    let ec2ServicePattern;
    switch (capacityType) {
      case EcsExtensionCapacityType.EC2:
        ec2ServicePattern = new Ec2ServicePattern(props);
        return ec2ServicePattern;
      case EcsExtensionCapacityType.FARGATE:
        return new FargateServicePattern(props);
      default:
        throw new Error(`unsupported capacity type: ${capacityType}`);
    }
  }
}
