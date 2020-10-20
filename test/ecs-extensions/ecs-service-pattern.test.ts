import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { App } from '@aws-cdk/core';

import { Ec2ServicePattern, FargateServicePattern } from '../../src/ecs-extensions/ecs-service-pattern';
import { TestingClusterStack } from '../../src/testing-cluster';

test('ec2 task memory limit/reserved should come from user input', () => {
  const app = new App();
  const testingCluster = new TestingClusterStack(app, 'stack');

  const pattern = new Ec2ServicePattern({
    cpuMinimum: 999,
    memoryReserved: 123,
    memoryLimit: 1234,
  });

  const taskInfo = pattern.bindTaskDefinition(testingCluster, testingCluster.cluster);
  expect(taskInfo.taskDefinition.isEc2Compatible).toBeTruthy();
  // Memory limit and reservation should come from the user values.
  expect(taskInfo.taskMemoryReserved).toEqual(123);
  expect(taskInfo.taskMemoryLimit).toEqual(1234);
});

test('ec2 task memory reserved should have a reasonable default', () => {
  const app = new App();
  const testingClusterStack = new TestingClusterStack(app, 'stack');

  // WHEN
  const pattern = new Ec2ServicePattern({
    memoryLimit: 1234,
  });

  const taskInfo = pattern.bindTaskDefinition(testingClusterStack, testingClusterStack.cluster);

  // THEN
  // Memory reservation default is 64 megs.
  expect(taskInfo.taskMemoryReserved).toEqual(64);
});

test('fargate task memory limit/reserved should come from fargate task size selected', () => {
  const app = new App();
  const testingClusterStack = new TestingClusterStack(app, 'stack');

  // WHEN
  const pattern = new FargateServicePattern({
    memoryReserved: 64,
    cpuMinimum: 1,
    memoryLimit: 256,
  });

  const taskInfo = pattern.bindTaskDefinition(testingClusterStack, testingClusterStack.cluster);

  // THEN
  // Memory limit and reservation should come from the selected fargate task.
  expect(taskInfo.taskMemoryLimit).toEqual(512);
  expect(taskInfo.taskMemoryReserved).toEqual(512);
});

test('fargate service configuration', () => {
  const app = new App();
  const testingClusterStack = new TestingClusterStack(app, 'stack');

  // WHEN
  const pattern = new FargateServicePattern({
    desiredCount: 50,
    memoryReserved: 64,
    cpuMinimum: 1,
    memoryLimit: 256,
  });

  const taskInfo = pattern.bindTaskDefinition(testingClusterStack, testingClusterStack.cluster);

  taskInfo.taskDefinition.addContainer('container', {
    image: ContainerImage.fromRegistry('nginx'),
  });

  pattern.bindService(testingClusterStack, testingClusterStack.cluster, taskInfo);

  // THEN

  expectCDK(testingClusterStack).to(
    haveResourceLike('AWS::ECS::Service', {
      DesiredCount: 50,
      PlatformVersion: '1.4.0',
    }),
  );
});
