import { SynthUtils } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
// @ts-ignore
import { IntegExploded } from './integ.exploded';

test('website-service', () => {
  const app = new App();
  const stack = new IntegExploded(app, 'exploded-integ');

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});