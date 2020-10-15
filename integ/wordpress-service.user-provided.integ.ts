import { InstanceClass, InstanceSize, InstanceType } from '@aws-cdk/aws-ec2';
import { FileSystem } from '@aws-cdk/aws-efs';
import { DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion } from '@aws-cdk/aws-rds';
import { App, CfnOutput, Fn, RemovalPolicy } from '@aws-cdk/core';

import { WordpressService } from '../lib';
import { EcsExtensionCapacityType } from '../lib/ecs-extensions';
import { TestingClusterStack } from '../lib/testing-cluster';

const app = new App();

const stack = new TestingClusterStack(app, 'wordpress-service-user-provided-integ');
const { cluster, albListener, alb } = stack;

const db = new DatabaseInstance(stack, 'database', {
  engine: DatabaseInstanceEngine.mysql({
    version: MysqlEngineVersion.VER_8_0,
  }),
  instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
  vpc: cluster.vpc,
  databaseName: 'wordpress',
});

const fs = new FileSystem(stack, 'files', {
  removalPolicy: RemovalPolicy.DESTROY,
  vpc: cluster.vpc,
});

if (!db.secret) {
  throw new Error('DatabaseInstance should have provided a secret');
}

new WordpressService(stack, 'Site', {
  cluster,
  albBasePriority: 1,
  albListener: albListener,
  primaryHostName: alb.loadBalancerDnsName,

  capacityType: EcsExtensionCapacityType.FARGATE,
  desiredCount: 4,

  databaseSecret: db.secret,
  databaseConnection: db,
  fileSystem: fs,
  fileSystemConnection: fs,

  wordpressImageOptions: {
    wordpressSourcePath: './user-provided-wordpress',
  },
});

new CfnOutput(stack, 'SiteUrl', {
  value: Fn.sub('http://${Domain}/', {
    Domain: alb.loadBalancerDnsName,
  }),
});

/**
 * To test:
 * $ cdk --output cdk.out.wordpress --app 'npx ts-node wordpress-service.user-provided.integ.ts' deploy
 * ...
 * wordpress-service-user-provided-integ.SiteUrl = http://somedomain/
 *
 * Then go to the URL. You should see a phpinfo output.
 */
