import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import * as ecs from '@aws-cdk/aws-ecs';
import * as efs from '@aws-cdk/aws-efs';
import * as ssm from '@aws-cdk/aws-secretsmanager';
import { Stack } from '@aws-cdk/core';

import { WordpressWorkload } from '../../src/wordpress-workload';

it('configures a task definition', () => {
  const stack = new Stack();
  const cluster = new ecs.Cluster(stack, 'cluster');

  const databaseSecret = new ssm.Secret(stack, 'DatabaseSecret');
  const fileSystem = new efs.FileSystem(stack, 'FileSystem', {
    vpc: cluster.vpc,
  });

  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDefinition', {
    cpu: 256,
    memoryLimitMiB: 512,
  });

  // WHEN
  const ext = new WordpressWorkload({
    databaseSecret: databaseSecret,
    fileSystem: fileSystem,
    wordpressDatabaseName: 'foobar',
  });

  ext.useTaskDefinition({
    taskDefinition: taskDefinition,
    taskMemoryReserved: 64,
    taskMemoryLimit: 512,
  });

  // THEN
  expect(ext.trafficContainer).toBeTruthy();
  expect(ext.trafficPort).toBeTruthy();

  expectCDK(stack).to(
    haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Name: 'web',
          Memory: 512,
          MountPoints: [
            {
              ContainerPath: '/data',
              ReadOnly: false,
              SourceVolume: 'files',
            },
          ],
          Environment: [{ Name: 'WORDPRESS_DB_NAME', Value: 'foobar' }],
          Secrets: [{ Name: 'WORDPRESS_DB_SECRET' }],
        },
      ],
    }),
  );
});
