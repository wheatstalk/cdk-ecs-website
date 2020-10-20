import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import { FileSystem } from '@aws-cdk/aws-efs';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import { App } from '@aws-cdk/core';

import { TestingClusterStack } from '../src/testing-cluster';
import { WordpressService } from '../src/wordpress-service';

it('honors desired count', () => {
  const app = new App();
  const testingClusterStack = new TestingClusterStack(app, 'test');

  const fileSystem = new FileSystem(testingClusterStack, 'fs', {
    vpc: testingClusterStack.cluster.vpc,
  });

  const databaseSecret = new Secret(testingClusterStack, 'secret');

  new WordpressService(testingClusterStack, 'service', {
    ...testingClusterStack,
    albBasePriority: 1,
    databaseSecret: databaseSecret,
    fileSystem: fileSystem,
    primaryHostName: 'www.foo.com',
    desiredCount: 5,
  });

  expectCDK(testingClusterStack).to(
    haveResourceLike('AWS::ECS::Service', {
      DesiredCount: 5,
    }),
  );
});
