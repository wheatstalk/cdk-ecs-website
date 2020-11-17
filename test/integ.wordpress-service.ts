import { InstanceClass, InstanceSize, InstanceType } from '@aws-cdk/aws-ec2';
import { FileSystem } from '@aws-cdk/aws-efs';
import { DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion } from '@aws-cdk/aws-rds';
import { App, CfnOutput, Construct, Fn, RemovalPolicy, Stack } from '@aws-cdk/core';

import { WordpressService } from '../src';
import { EcsWorkloadCapacityType } from '../src/ecs-workloads';
import { TestingCluster } from '../src/testing-cluster';

export class IntegWordpressService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const testingCluster = new TestingCluster(this, 'Cluster');

    const db = new DatabaseInstance(testingCluster, 'database', {
      engine: DatabaseInstanceEngine.mysql({
        version: MysqlEngineVersion.VER_8_0,
      }),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      vpc: testingCluster.cluster.vpc,
      databaseName: 'wordpress',
    });

    const fs = new FileSystem(testingCluster, 'files', {
      removalPolicy: RemovalPolicy.DESTROY,
      vpc: testingCluster.cluster.vpc,
    });

    if (!db.secret) {
      throw new Error('DatabaseInstance should have provided a secret');
    }

    new WordpressService(testingCluster, 'Site', {
      cluster: testingCluster.cluster,
      albBasePriority: 1,
      albListener: testingCluster.albListener,
      primaryHostName: testingCluster.alb.loadBalancerDnsName,

      capacityType: EcsWorkloadCapacityType.FARGATE,
      desiredCount: 4,

      databaseSecret: db.secret,
      databaseConnection: db,
      fileSystem: fs,
      fileSystemConnection: fs,

      wordpressImageOptions: {
        wordpressVersion: '5.5.2',
      },
    });

    new CfnOutput(testingCluster, 'SiteUrl', {
      value: Fn.sub('http://${Domain}/', {
        Domain: testingCluster.alb.loadBalancerDnsName,
      }),
    });
  }
}

const app = new App();
new IntegWordpressService(app, 'wordpress-service-integ');

/**
 * To test:
 * $ ./integ.sh wordpress-service
 * ...
 * wordpress-service-integ.SiteUrl = http://somedomain/
 *
 * Then go to the URL and complete the wordpress installation. The service may
 * restart a few times until you finish the install because of the wp-install
 * redirect.
 */
