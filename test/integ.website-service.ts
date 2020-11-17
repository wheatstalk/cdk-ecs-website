import { ContainerImage } from '@aws-cdk/aws-ecs';
import { App, CfnOutput, Construct, Fn, Stack } from '@aws-cdk/core';

import { WebsiteService } from '../src';
import { TestingCluster } from '../src/testing-cluster';

export class IntegWebsiteService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const testingCluster = new TestingCluster(this, 'Cluster');

    new WebsiteService(testingCluster, 'Website', {
      albBasePriority: 2000,
      albListener: testingCluster.albListener,
      cluster: testingCluster.cluster,
      desiredCount: 4,
      containerImage: ContainerImage.fromRegistry('nginx'),
      containerPort: 80,
      primaryHostName: testingCluster.alb.loadBalancerDnsName,
    });

    new CfnOutput(testingCluster, 'SiteUrl', {
      value: Fn.sub('http://${Domain}/', {
        Domain: testingCluster.alb.loadBalancerDnsName,
      }),
    });
  }
}

const app = new App();
new IntegWebsiteService(app, 'website-service-integ');

/**
 * To test:
 * $ ./integ.sh website-service
 * ...
 * website-service-integ.SiteUrl = http://somedomain/
 *
 * Then go to the URL. You should see nginx.
 */
