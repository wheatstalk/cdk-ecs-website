import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import { InstanceType } from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ssm from '@aws-cdk/aws-secretsmanager';
import { Stack } from '@aws-cdk/core';

import { HttpContainerWorkload } from '../../src/http-container-workload';

it('sets all properties', () => {
  const stack = new Stack();
  const cluster = new ecs.Cluster(stack, 'cluster');
  cluster.addCapacity('ec2', { instanceType: new InstanceType('t3.micro') });

  const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');

  const secret = new ssm.Secret(stack, 'secret');

  // WHEN
  const binding = new HttpContainerWorkload({
    containerImage: ecs.ContainerImage.fromRegistry('nginx'),
    containerPort: 3000,
    envVars: {
      Env1: 'Env1Value',
    },
    envSecrets: {
      Secret1: ecs.Secret.fromSecretsManager(secret),
    },
  });

  binding.useTaskDefinition({
    taskMemoryReserved: 64,
    taskMemoryLimit: 512,
    taskDefinition,
  });

  // THEN
  expectCDK(stack).to(
    haveResourceLike('AWS::ECS::TaskDefinition', {
      // NetworkMode: 'host',
      ContainerDefinitions: [
        {
          MemoryReservation: 64,
          Memory: 512,
          Environment: [{ Name: 'Env1', Value: 'Env1Value' }],
          PortMappings: [{ ContainerPort: 3000, Protocol: 'tcp' }],
        },
      ],
    }),
  );
});

it('works with fargate', () => {
  const stack = new Stack();
  const cluster = new ecs.Cluster(stack, 'cluster');
  cluster.addCapacity('ec2', { instanceType: new InstanceType('t3.micro') });

  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDefinition');

  // WHEN
  const binding = new HttpContainerWorkload({
    containerImage: ecs.ContainerImage.fromRegistry('nginx'),
  });
  binding.useTaskDefinition({
    taskMemoryLimit: 512,
    taskMemoryReserved: 64,
    taskDefinition,
  });

  // THEN
  expectCDK(stack).to(
    haveResourceLike('AWS::ECS::TaskDefinition', {
      NetworkMode: 'awsvpc',
      ContainerDefinitions: [
        {
          MemoryReservation: 64,
          Memory: 512,
        },
      ],
    }),
  );
});
