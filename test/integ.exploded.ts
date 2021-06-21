import * as fs from 'fs';
import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import { ListenerRulePriorities, ListenerRulesBuilder, NginxProxyContainerExtension } from '../src';

export class IntegExploded extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE,
          cidrMask: 22,
        },
      ],
    });

    const alb = new elbv2.ApplicationLoadBalancer(this, 'Alb', {
      vpc,
      internetFacing: true,
    });

    const albListener = alb.addListener('http', {
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultAction: elbv2.ListenerAction.fixedResponse(404, {
        contentType: 'text/plain',
        messageBody: 'Nothing here',
      }),
    });

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDefinition', {
      cpu: 512,
      memoryLimitMiB: 1024,
    });

    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
      environment: {
        PORT: '3000',
      },
      portMappings: [{
        containerPort: 3000,
      }],
    });

    const defaultConf = fs.readFileSync(path.join(__dirname, 'integ.exploded.reverse-proxy.conf')).toString();
    taskDefinition.addExtension(new NginxProxyContainerExtension({ defaultConf }));

    const service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition,
      desiredCount: 1,
    });

    const listenerRulesBuilder = new ListenerRulesBuilder(this, 'ListenerRulesBuilder', {
      service,
      albListener,
      albPriority: ListenerRulePriorities.incremental(5000, 10),
      primaryHostName: alb.loadBalancerDnsName,
      trafficContainerName: taskDefinition.defaultContainer!.containerName,
      trafficPort: taskDefinition.defaultContainer!.containerPort,
    });

    listenerRulesBuilder.addServingHost(alb.loadBalancerDnsName);
    listenerRulesBuilder.addRedirectToPrimaryHostName('redirect.host');

    new cdk.CfnOutput(this, 'LoadBalancer', {
      value: cdk.Fn.sub('http://${LoadBalancerDnsName}/', {
        LoadBalancerDnsName: alb.loadBalancerDnsName,
      }),
    });
  }
}

const app = new cdk.App();
new IntegExploded(app, 'exploded-integ');