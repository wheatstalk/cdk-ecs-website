import { SynthUtils } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
// @ts-ignore
import { IntegWordpressServiceUserProvided } from './integ.wordpress-service.user-provided';

test('website-service', () => {
  const app = new App();
  const stack = new IntegWordpressServiceUserProvided(app, 'wordpress-service-integ');

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});