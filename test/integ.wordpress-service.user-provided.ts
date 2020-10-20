import * as path from 'path';
import { InstanceClass, InstanceSize, InstanceType } from '@aws-cdk/aws-ec2';
import { FileSystem } from '@aws-cdk/aws-efs';
import { DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion } from '@aws-cdk/aws-rds';
import { App, CfnOutput, Fn, RemovalPolicy } from '@aws-cdk/core';

import { WordpressService } from '../src';
import { EcsWorkloadCapacityType } from '../src/ecs-workloads';
import { TestingClusterStack } from '../src/testing-cluster';

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

  capacityType: EcsWorkloadCapacityType.FARGATE,
  desiredCount: 4,

  databaseSecret: db.secret,
  databaseConnection: db,
  fileSystem: fs,
  fileSystemConnection: fs,

  wordpressImageOptions: {
    wordpressSourcePath: path.join(__dirname, 'user-provided-wordpress'),
  },
});

new CfnOutput(stack, 'SiteUrl', {
  value: Fn.sub('http://${Domain}/', {
    Domain: alb.loadBalancerDnsName,
  }),
});

/**
 * To test:
 * $ ./integ.sh wordpress-service.user-provided
 * ...
 * wordpress-service-user-provided-integ.SiteUrl = http://somedomain/
 *
 * Then go to the URL. You should see a phpinfo output.
 */
