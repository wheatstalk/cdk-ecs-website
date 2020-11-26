import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import { UserPool } from '@aws-cdk/aws-cognito';
import * as ecs from '@aws-cdk/aws-ecs';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { App } from '@aws-cdk/core';

import { WebsiteService } from '../src';
import { TestingClusterStack } from '../src/testing-cluster';

describe('WebsiteService', () => {
  it('produces an ecs service', () => {
    // GIVEN
    const given = new TestingClusterStack(new App(), 'stack');

    // WHEN
    const service = new WebsiteService(given, 'Test', {
      cluster: given.cluster,
      containerImage: ecs.ContainerImage.fromRegistry('nginx'),
      albBasePriority: 20000,
      albListener: given.albListener,
      primaryHostName: 'www.example.com',
    });
    service.addRedirectToPrimaryHostName('*.example.com');
    service.addRedirectResponse('*.example2.com', {
      host: 'amazonaws.com',
    });

    // THEN defines a service, task definition, and target group
    expectCDK(given).to(haveResourceLike('AWS::ECS::Service'));
    expectCDK(given).to(haveResourceLike('AWS::ECS::TaskDefinition'));
    expectCDK(given).to(haveResourceLike('AWS::ElasticLoadBalancingV2::TargetGroup'));

    // THEN defines listener rules
    expectCDK(given).to(
      haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
        Conditions: [
          {
            Field: 'host-header',
            HostHeaderConfig: {
              Values: ['www.example.com'],
            },
          },
        ],
        Priority: 20000,
      }),
    );

    expectCDK(given).to(
      haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
        Actions: [
          {
            Type: 'redirect',
            RedirectConfig: {
              Host: 'www.example.com',
              Path: '/#{path}',
              Port: '#{port}',
              Protocol: '#{protocol}',
              Query: '#{query}',
              StatusCode: 'HTTP_302',
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
      }),
    );

    expectCDK(given).to(
      haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
        Actions: [
          {
            Type: 'redirect',
            RedirectConfig: {
              Host: 'amazonaws.com',
              Path: '/#{path}',
              Port: '#{port}',
              Protocol: '#{protocol}',
              Query: '#{query}',
              StatusCode: 'HTTP_302',
            },
          },
        ],
        Conditions: [
          {
            Field: 'host-header',
            Values: ['*.example2.com'],
          },
        ],
        Priority: 20002,
      }),
    );
  });

  it('produces a userpool client and authenticated listener', () => {
    const given = new TestingClusterStack(new App(), 'stack');
    const userPool = new UserPool(given, 'UserPool');

    new WebsiteService(given, 'Service', {
      albBasePriority: 1,
      albListener: given.albListener,
      cluster: given.cluster,
      containerImage: ecs.ContainerImage.fromRegistry('nginx'),
      primaryHostName: 'www.example.com',
      authWithUserPool: {
        userPool: userPool,
        domain: 'auth.example.com',
      },
    });

    expectCDK(given).to(haveResourceLike('AWS::Cognito::UserPoolClient'));
    expectCDK(given).to(
      haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
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
            HostHeaderConfig: {
              Values: ['www.example.com'],
            },
          },
        ],
        Priority: 1,
      }),
    );
  });

  it('provides a listener with an access bypass', () => {
    const given = new TestingClusterStack(new App(), 'stack');
    const userPool = new UserPool(given, 'UserPool');

    new WebsiteService(given, 'Service', {
      albBasePriority: 1,
      albListener: given.albListener,
      cluster: given.cluster,
      containerImage: ecs.ContainerImage.fromRegistry('nginx'),
      primaryHostName: 'www.example.com',
      authBypassHeaderValue: 'bypassvalue',
      authWithUserPool: {
        userPool: userPool,
        domain: 'auth.example.com',
      },
    });

    expectCDK(given).to(haveResourceLike('AWS::Cognito::UserPoolClient'));

    expectCDK(given).to(
      haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
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
            HostHeaderConfig: {
              Values: ['www.example.com'],
            },
          },
        ],
        Priority: 1,
      }),
    );

    expectCDK(given).to(
      haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
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
            HostHeaderConfig: {
              Values: ['www.example.com'],
            },
          },
        ],
        Priority: 2,
      }),
    );
  });
});

it('adds listener rules', () => {
  const app = new App();
  const stack = new TestingClusterStack(app, 'basic-http-service-integ');

  const website = new WebsiteService(stack, 'Website', {
    albBasePriority: 2000,
    albListener: stack.albListener,
    cluster: stack.cluster,
    containerImage: ecs.ContainerImage.fromRegistry('nginx'),
    containerPort: 80,
    primaryHostName: 'www.example.com',
  });

  // website.addServingHost('example2.com');
  website.addRedirectToPrimaryHostName('*.example.com');

  app.synth();
});

it('works on port 3000', () => {
  const app = new App();
  const stack = new TestingClusterStack(app, 'basic-http-service-integ');

  new WebsiteService(stack, 'Website', {
    albBasePriority: 2000,
    albListener: stack.albListener,
    cluster: stack.cluster,
    containerImage: ecs.ContainerImage.fromRegistry('nginx'),
    containerPort: 3000,
    primaryHostName: stack.alb.loadBalancerDnsName,
  });

  app.synth();
});

it('adds serving hosts from the constructor', () => {
  const app = new App();
  const stack = new TestingClusterStack(app, 'basic-http-service-integ');

  new WebsiteService(stack, 'Website', {
    albBasePriority: 2000,
    albListener: stack.albListener,
    cluster: stack.cluster,
    containerImage: ecs.ContainerImage.fromRegistry('nginx'),
    containerPort: 3000,
    primaryHostName: stack.alb.loadBalancerDnsName,
    additionalServingHosts: ['foobar.baz'],
  });

  expectCDK(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
    Priority: 2001,
    Conditions: [
      {
        Field: 'host-header',
        HostHeaderConfig: {
          Values: ['foobar.baz'],
        },
      },
    ],
    Actions: [
      {
        Type: 'forward',
      },
    ],
  }));
});

it('adds redirects from the constructor', () => {
  const app = new App();
  const stack = new TestingClusterStack(app, 'basic-http-service-integ');

  new WebsiteService(stack, 'Website', {
    albBasePriority: 2000,
    albListener: stack.albListener,
    cluster: stack.cluster,
    containerImage: ecs.ContainerImage.fromRegistry('nginx'),
    containerPort: 3000,
    primaryHostName: 'primary-domain.com',
    redirects: [
      { hostHeader: 'foobar1.baz' },
      { hostHeader: 'foobar2.baz', redirect: { host: 'aws.amazon.com' } },
    ],
  });

  expectCDK(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
    Priority: 2001,
    Conditions: [
      {
        Field: 'host-header',
        Values: ['foobar1.baz'],
      },
    ],
    Actions: [
      {
        Type: 'redirect',
        RedirectConfig: {
          Host: 'primary-domain.com',
        },
      },
    ],
  }));

  expectCDK(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
    Priority: 2002,
    Conditions: [
      {
        Field: 'host-header',
        Values: ['foobar2.baz'],
      },
    ],
    Actions: [
      {
        Type: 'redirect',
        RedirectConfig: {
          Host: 'aws.amazon.com',
        },
      },
    ],
  }));
});

it('allows environment variables', () => {
  const app = new App();
  const testingClusterStack = new TestingClusterStack(app, 'test');

  new WebsiteService(testingClusterStack, 'service', {
    ...testingClusterStack,
    albBasePriority: 1,
    containerImage: ecs.ContainerImage.fromRegistry('nginx'),
    primaryHostName: 'www.foo.com',
    desiredCount: 5,
    envVars: {
      FOO: 'BAR',
    },
  });

  expectCDK(testingClusterStack).to(
    haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [{ Name: 'FOO', Value: 'BAR' }],
        },
      ],
    }),
  );
});

it('allows secret environment variables', () => {
  const app = new App();
  const testingClusterStack = new TestingClusterStack(app, 'test');

  const databaseSecret = new secretsmanager.Secret(testingClusterStack, 'secret');

  new WebsiteService(testingClusterStack, 'service', {
    ...testingClusterStack,
    albBasePriority: 1,
    containerImage: ecs.ContainerImage.fromRegistry('nginx'),
    primaryHostName: 'www.foo.com',
    desiredCount: 5,
    envSecrets: {
      FOO: ecs.Secret.fromSecretsManager(databaseSecret),
    },
  });

  expectCDK(testingClusterStack).to(
    haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Secrets: [
            { Name: 'FOO' },
          ],
        },
      ],
    }),
  );
});

it('can add a reverse proxy', () => {
  const app = new App();
  const testingClusterStack = new TestingClusterStack(app, 'test');

  new WebsiteService(testingClusterStack, 'service', {
    ...testingClusterStack,
    albBasePriority: 1,
    containerImage: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    primaryHostName: 'www.foo.com',
    nginxContainerConfig: 'CONFIG',
  });

  expectCDK(testingClusterStack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      { Name: 'web' },
      { Name: 'proxy' },
    ],
  }));
});