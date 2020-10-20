import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { App } from '@aws-cdk/core';

import { EcsWorkloadTaskInfo, EcsWorkloadService } from '../../src/ecs-workloads';
import { TestingClusterStack } from '../../src/testing-cluster';

test('it uses its desiredCount prop', () => {
  const testClusterStack = new TestingClusterStack(new App(), 'stack');

  // WHEN
  new EcsWorkloadService(testClusterStack, 'service', {
    cluster: testClusterStack.cluster,
    desiredCount: 5,
    serviceExtension: {
      useTaskDefinition(taskDefinitionInfo: EcsWorkloadTaskInfo): void {
        taskDefinitionInfo.taskDefinition.addContainer('web', {
          image: ContainerImage.fromRegistry('nginx'),
          memoryLimitMiB: 512,
        });
      },
      useService: (): void => undefined,
      trafficPort: 80,
      trafficContainer: 'web',
    },
  });

  // THEN
  expectCDK(testClusterStack).to(
    haveResourceLike('AWS::ECS::Service', {
      DesiredCount: 5,
    }),
  );
});
