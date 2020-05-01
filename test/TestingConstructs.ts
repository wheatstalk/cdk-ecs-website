import { InstanceType } from '@aws-cdk/aws-ec2';
import { Cluster } from '@aws-cdk/aws-ecs';
import {
  ApplicationListener,
  ApplicationLoadBalancer,
  ApplicationProtocol,
  ContentType,
} from '@aws-cdk/aws-elasticloadbalancingv2';
import { Stack } from '@aws-cdk/core';

export class TestingConstructs extends Stack {
  public cluster: Cluster;
  public alb: ApplicationLoadBalancer;
  public albListener: ApplicationListener;

  constructor() {
    super();

    this.cluster = new Cluster(this, 'Cluster');

    this.cluster.addCapacity('capacity', {
      instanceType: new InstanceType('t2.micro'),
    });

    this.alb = new ApplicationLoadBalancer(this, 'Alb', {
      vpc: this.cluster.vpc,
    });

    this.albListener = this.alb.addListener('listener', {
      protocol: ApplicationProtocol.HTTP,
    });

    this.albListener.addFixedResponse('default', {
      contentType: ContentType.TEXT_PLAIN,
      messageBody: 'default',
      statusCode: '404',
    });
  }
}
