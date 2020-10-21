import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import * as ecs from '@aws-cdk/aws-ecs';
import { FileSystem } from '@aws-cdk/aws-efs';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { App } from '@aws-cdk/core';

import { WordpressService } from '../src';
import { TestingClusterStack } from '../src/testing-cluster';

it('honors desired count', () => {
  const app = new App();
  const testingClusterStack = new TestingClusterStack(app, 'test');

  const fileSystem = new FileSystem(testingClusterStack, 'fs', {
    vpc: testingClusterStack.cluster.vpc,
  });

  const databaseSecret = new secretsmanager.Secret(testingClusterStack, 'secret');

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

it('allows environment variables', () => {
  const app = new App();
  const testingClusterStack = new TestingClusterStack(app, 'test');

  const fileSystem = new FileSystem(testingClusterStack, 'fs', {
    vpc: testingClusterStack.cluster.vpc,
  });

  const databaseSecret = new secretsmanager.Secret(testingClusterStack, 'secret');

  new WordpressService(testingClusterStack, 'service', {
    ...testingClusterStack,
    albBasePriority: 1,
    databaseSecret: databaseSecret,
    fileSystem: fileSystem,
    primaryHostName: 'www.foo.com',
    desiredCount: 5,
    envVars: {
      FOO: 'BAR',
    },
  });

  expectCDK(testingClusterStack).to(
    haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [{ Name: 'FOO', Value: 'BAR' }],
        },
      ],
    }),
  );
});

it('allows secret environment variables', () => {
  const app = new App();
  const testingClusterStack = new TestingClusterStack(app, 'test');

  const fileSystem = new FileSystem(testingClusterStack, 'fs', {
    vpc: testingClusterStack.cluster.vpc,
  });

  const databaseSecret = new secretsmanager.Secret(testingClusterStack, 'secret');

  new WordpressService(testingClusterStack, 'service', {
    ...testingClusterStack,
    albBasePriority: 1,
    databaseSecret: databaseSecret,
    fileSystem: fileSystem,
    primaryHostName: 'www.foo.com',
    desiredCount: 5,
    envSecrets: {
      FOO: ecs.Secret.fromSecretsManager(databaseSecret),
    },
  });

  expectCDK(testingClusterStack).to(
    haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Secrets: [
            { Name: 'WORDPRESS_DB_SECRET' },
            { Name: 'FOO' },
          ],
        },
      ],
    }),
  );
});