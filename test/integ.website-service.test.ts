import { SynthUtils } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
// @ts-ignore
import { IntegWebsiteService } from './integ.website-service';

test('website-service', () => {
  const app = new App();
  const stack = new IntegWebsiteService(app, 'website-service-integ');

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});