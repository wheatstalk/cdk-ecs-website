import { SynthUtils } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
// @ts-ignore
import { IntegWordpressService } from './integ.wordpress-service';

test('website-service', () => {
  const app = new App();
  const stack = new IntegWordpressService(app, 'wordpress-service-integ');

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});