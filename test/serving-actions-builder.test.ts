import { UserPool } from '@aws-cdk/aws-cognito';
import { ApplicationTargetGroup } from '@aws-cdk/aws-elasticloadbalancingv2';
import { Stack } from '@aws-cdk/core';

import { ServingActionsBuilder } from '../lib/serving-actions-builder';

describe('ServingActionsBuilder', () => {
  it('provides a forward action', () => {
    const stack = new Stack();
    const targetGroup = new ApplicationTargetGroup(stack, 'TG');
    const builder = new ServingActionsBuilder(targetGroup);

    const actions = builder.build();
    expect(actions.length).toEqual(1);
    expect(actions[0].order).toEqual(1);
    expect(actions[0].type).toEqual('forward');
  });

  it('provides an authentication action', () => {
    const stack = new Stack();
    const targetGroup = new ApplicationTargetGroup(stack, 'TG');
    const userPool = new UserPool(stack, 'UserPool');
    const userPoolClient = userPool.addClient('Client');

    const builder = new ServingActionsBuilder(targetGroup);
    builder.userPoolInfo = {
      userPoolClient: userPoolClient,
      userPool: userPool,
      domain: 'auth.example.com',
    };

    const actions = builder.build();

    expect(actions.length).toEqual(2);

    expect(actions[0].order).toEqual(1);
    expect(actions[0].type).toEqual('authenticate-cognito');

    expect(actions[1].order).toEqual(2);
    expect(actions[1].type).toEqual('forward');
  });
});
