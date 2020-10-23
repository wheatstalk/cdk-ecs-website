import * as path from 'path';
import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import * as ecs from '@aws-cdk/aws-ecs';
import { FileSystem } from '@aws-cdk/aws-efs';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { App } from '@aws-cdk/core';

import * as fs from 'fs-extra';
import { EcsWorkloadCapacityType, WordpressService } from '../src';
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

it('passes wordpressImageOptions', () => {
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
    wordpressImageOptions: {
      wordpressSourcePath: path.join(__dirname, 'user-provided-wordpress'),
    },
  });

  const outDir = app.outdir;
  const assetPath = fs.readdirSync(outDir).find(p => /asset\./.test(p));
  expect(assetPath).toBeTruthy();

  const assetFullPath = path.join(outDir, assetPath ?? '');
  expect(fs.existsSync(path.join(assetFullPath, 'Dockerfile'))).toBeTruthy();
  expect(fs.existsSync(path.join(assetFullPath, 'wordpress', 'index.php'))).toBeTruthy();
});

describe('honors capacity type', () => {
  const cases: [EcsWorkloadCapacityType, string][] = [
    [EcsWorkloadCapacityType.EC2, 'EC2'],
    [EcsWorkloadCapacityType.FARGATE, 'FARGATE'],
  ];
  it.each(cases)('capacity %s -> %s', (capacityType, launchType) => {
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
      capacityType,
    });

    expectCDK(testingClusterStack).to(haveResourceLike('AWS::ECS::Service', {
      LaunchType: launchType,
    }));
  });
});