import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import { UserPool } from '@aws-cdk/aws-cognito';
import { ContainerImage } from '@aws-cdk/aws-ecs';

import { TestingConstructs } from './TestingConstructs';
import { WebsiteService } from '../lib';

describe('WebsiteService', () => {
  it('produces an ecs service', () => {
    // GIVEN
    const given = new TestingConstructs();

    // WHEN
    const service = new WebsiteService(given, 'Test', {
      cluster: given.cluster,
      containerImage: ContainerImage.fromRegistry('nginx'),
      albBasePriority: 20000,
      albListener: given.albListener,
      primaryHostName: 'www.example.com',
    });
    service.addRedirectToPrimaryHostName('*.example.com');

    // THEN defines a service, task definition, and target group
    expectCDK(given).to(haveResourceLike('AWS::ECS::Service'));
    expectCDK(given).to(haveResourceLike('AWS::ECS::TaskDefinition'));
    expectCDK(given).to(haveResourceLike('AWS::ElasticLoadBalancingV2::TargetGroup'));

    // THEN defines listener rules
    expectCDK(given).to(haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Conditions: [
        {
          Field: 'host-header',
          Values: ['www.example.com'],
        },
      ],
      Priority: 20000,
    }));

    expectCDK(given).to(haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          Type: 'redirect',
          RedirectConfig: {
            Host: 'www.example.com',
            Path: '/#{path}',
            Port: '#{port}',
            Protocol: '#{protocol}',
            Query: '#{query}',
            StatusCode: 'HTTP_301',
          },
        },
      ],
      Conditions: [
        {
          Field: 'host-header',
          Values: ['*.example.com'],
        },
      ],
      Priority: 20001,
    }));
  });
  it('produces a userpool and authenticated listener', () => {

    const given = new TestingConstructs();
    const userPool = new UserPool(given, 'UserPool');

    new WebsiteService(given, 'Service', {
      albBasePriority: 0,
      albListener: given.albListener,
      cluster: given.cluster,
      containerImage: ContainerImage.fromRegistry('nginx'),
      primaryHostName: 'www.example.com',
      authWithUserPool: {
        userPool: userPool,
        domain: 'auth.example.com',
      },
    });

    expectCDK(given).to(haveResourceLike('AWS::Cognito::UserPoolClient'));
    expectCDK(given).to(haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          AuthenticateCognitoConfig: {
            UserPoolDomain: 'auth.example.com',
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
          Values: ['www.example.com'],
        },
      ],
      Priority: 0,
    }));

  });
  it('provides a listener with an access bypass', () => {
    const given = new TestingConstructs();
    const userPool = new UserPool(given, 'UserPool');

    new WebsiteService(given, 'Service', {
      albBasePriority: 0,
      albListener: given.albListener,
      cluster: given.cluster,
      containerImage: ContainerImage.fromRegistry('nginx'),
      primaryHostName: 'www.example.com',
      authBypassHeaderValue: 'bypassvalue',
      authWithUserPool: {
        userPool: userPool,
        domain: 'auth.example.com',
      },
    });

    expectCDK(given).to(haveResourceLike('AWS::Cognito::UserPoolClient'));

    expectCDK(given).to(haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          Type: 'forward',
        },
      ],
      Conditions: [
        {
          Field: 'http-header',
          HttpHeaderConfig: {
            HttpHeaderName: 'AccessBypass',
            Values: ['bypassvalue'],
          },
        },
        {
          Field: 'host-header',
          Values: ['www.example.com'],
        },
      ],
    }));

    expectCDK(given).to(haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          AuthenticateCognitoConfig: {
            UserPoolDomain: 'auth.example.com',
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
          Values: ['www.example.com'],
        },
      ],
      Priority: 1,
    }));
  });
});
