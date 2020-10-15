import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { App } from '@aws-cdk/core';

import { TestingClusterStack } from '../testing-cluster';
import { TaskDefinitionBindingInfo } from './ecs-extension';
import { EcsExtensionService } from './ecs-extension-service';

test('it uses its desiredCount prop', () => {
  const testClusterStack = new TestingClusterStack(new App(), 'stack');

  // WHEN
  new EcsExtensionService(testClusterStack, 'service', {
    cluster: testClusterStack.cluster,
    desiredCount: 5,
    serviceExtension: {
      useTaskDefinition(taskDefinitionInfo: TaskDefinitionBindingInfo): void {
        taskDefinitionInfo.taskDefinition.addContainer('web', {
          image: ContainerImage.fromRegistry('nginx'),
          memoryLimitMiB: 512,
        });
      },
      useService: (): void => undefined,
      getTrafficPort: (): number => 80,
      getTrafficContainer: (): string => 'web',
    },
  });

  // THEN
  expectCDK(testClusterStack).to(
    haveResourceLike('AWS::ECS::Service', {
      DesiredCount: 5,
    }),
  );
});
