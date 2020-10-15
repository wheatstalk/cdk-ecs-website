import { ContainerImage } from '@aws-cdk/aws-ecs';
import { App, CfnOutput, Fn } from '@aws-cdk/core';

import { WebsiteService } from '../lib';
import { TestingClusterStack } from '../lib/testing-cluster';

const app = new App();
const stack = new TestingClusterStack(app, 'website-service-integ');

const { alb } = stack;

new WebsiteService(stack, 'Website', {
  albBasePriority: 2000,
  albListener: stack.albListener,
  cluster: stack.cluster,
  desiredCount: 4,
  containerImage: ContainerImage.fromRegistry('nginx'),
  containerPort: 80,
  primaryHostName: stack.alb.loadBalancerDnsName,
});

new CfnOutput(stack, 'SiteUrl', {
  value: Fn.sub('http://${Domain}/', {
    Domain: alb.loadBalancerDnsName,
  }),
});

/**
 * To test:
 * $ cdk --output cdk.out.website --app 'npx ts-node website-service.integ.ts' deploy
 * ...
 * website-service-integ.SiteUrl = http://somedomain/
 *
 * Then go to the URL. You should see nginx.
 */
