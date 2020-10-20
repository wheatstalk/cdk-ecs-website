import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import { UserPool } from '@aws-cdk/aws-cognito';
import { SecurityGroup } from '@aws-cdk/aws-ec2';
import { ContainerImage, Ec2Service, Ec2TaskDefinition } from '@aws-cdk/aws-ecs';
import { ApplicationListener } from '@aws-cdk/aws-elasticloadbalancingv2';
import { App } from '@aws-cdk/core';

import { ListenerRulesBuilder } from '../../src/listener-rules-builder';
import { TestingClusterStack } from '../../src/testing-cluster';

test('add all rules', () => {
  const app = new App();
  const testCluster = new TestingClusterStack(app, 'test');
  const taskDefinition = new Ec2TaskDefinition(testCluster, 'TaskDefinition');
  const container = taskDefinition.addContainer('main', {
    image: ContainerImage.fromRegistry('nginx'),
    memoryLimitMiB: 256,
  });
  container.addPortMappings({
    containerPort: 80,
  });

  const userPool = new UserPool(testCluster, 'UserPool');

  const service = new Ec2Service(testCluster, 'Service', {
    ...testCluster,
    taskDefinition: taskDefinition,
  });

  const lrb = new ListenerRulesBuilder(testCluster, 'lrb', {
    ...testCluster,
    albBasePriority: 40000,
    containerName: 'main',
    trafficPort: 80,
    primaryHostName: 'www.example.com',
    service: service,
  });

  // WHEN
  lrb.addServingHost('www.example.com');
  lrb.addRedirectResponse('other.example.com', {
    host: 'www.google.com',
  });
  lrb.addAuthBypassServingHost('auth.example.com', 'password');
  lrb.addAuthenticatedServingHost('auth.example.com', {
    domain: 'auth.myexample.com',
    userPool: userPool,
  });
  lrb.addRedirectToPrimaryHostName('*.example.com');

  // THEN
  expectCDK(testCluster).to(
    // Serves on the primary host name
    haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [{ Type: 'forward' }],
      Conditions: [{ Field: 'host-header', HostHeaderConfig: { Values: ['www.example.com'] } }],
      Priority: 40000,
    }),
  );

  expectCDK(testCluster).to(
    // Redirects to google.com
    haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          RedirectConfig: {
            Host: 'www.google.com',
            Path: '/#{path}',
            Port: '#{port}',
            Protocol: '#{protocol}',
            Query: '#{query}',
            StatusCode: 'HTTP_302',
          },
          Type: 'redirect',
        },
      ],
      Conditions: [{ Field: 'host-header', Values: ['other.example.com'] }],
      Priority: 40001,
    }),
  );

  expectCDK(testCluster).to(
    // Forwards when the `AccessBypass` header matches.
    haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [{ Type: 'forward' }],
      Conditions: [
        {
          Field: 'http-header',
          HttpHeaderConfig: {
            HttpHeaderName: 'AccessBypass',
            Values: ['password'],
          },
        },
        {
          Field: 'host-header',
          HostHeaderConfig: {
            Values: ['auth.example.com'],
          },
        },
      ],
      Priority: 40002,
    }),
  );

  expectCDK(testCluster).to(
    // Authenticates and then forwards to the target group
    haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          AuthenticateCognitoConfig: {
            UserPoolDomain: 'auth.myexample.com',
          },
          Order: 1,
          Type: 'authenticate-cognito',
        },
        {
          Order: 2,
          Type: 'forward',
        },
      ],
      Conditions: [
        {
          Field: 'host-header',
          HostHeaderConfig: {
            Values: ['auth.example.com'],
          },
        },
      ],
      Priority: 40003,
    }),
  );

  expectCDK(testCluster).to(
    // Redirects to the primary domain
    haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          RedirectConfig: {
            Host: 'www.example.com',
            Path: '/#{path}',
            Port: '#{port}',
            Protocol: '#{protocol}',
            Query: '#{query}',
            StatusCode: 'HTTP_302',
          },
          Type: 'redirect',
        },
      ],
      Conditions: [{ Field: 'host-header', Values: ['*.example.com'] }],
      Priority: 40004,
    }),
  );

  // end
});

test('add rules to an imported listener', () => {
  const app = new App();
  const testCluster = new TestingClusterStack(app, 'test');
  const taskDefinition = new Ec2TaskDefinition(testCluster, 'TaskDefinition');
  const container = taskDefinition.addContainer('main', {
    image: ContainerImage.fromRegistry('nginx'),
    memoryLimitMiB: 256,
  });
  container.addPortMappings({
    containerPort: 80,
  });

  const userPool = new UserPool(testCluster, 'UserPool');

  const service = new Ec2Service(testCluster, 'Service', {
    ...testCluster,
    taskDefinition: taskDefinition,
  });

  const albListener = ApplicationListener.fromApplicationListenerAttributes(testCluster, 'Imported', {
    listenerArn: 'arn:something',
    securityGroup: SecurityGroup.fromSecurityGroupId(testCluster, 'SecurityGroup', 'sg-something'),
  });

  const lrb = new ListenerRulesBuilder(testCluster, 'lrb', {
    cluster: testCluster.cluster,
    albListener: albListener,
    albBasePriority: 40000,
    containerName: 'main',
    trafficPort: 80,
    primaryHostName: 'www.example.com',
    service: service,
  });

  lrb.addServingHost('www.example.com');
  lrb.addRedirectResponse('other.example.com', {
    host: 'www.google.com',
  });
  lrb.addAuthBypassServingHost('auth.example.com', 'password');
  lrb.addAuthenticatedServingHost('auth.example.com', {
    domain: 'auth.myexample.com',
    userPool: userPool,
  });
  lrb.addRedirectToPrimaryHostName('*.example.com');
});
