import { Construct } from '@aws-cdk/core';

import { WebsiteServiceBase, WebsiteServiceOptions } from './website-service-base';
import { WordpressExtension, WordpressExtensionOptions } from './wordpress-extension';

export interface WordpressServiceProps extends WebsiteServiceOptions, WordpressExtensionOptions {}

/**
 * Create a website service.
 */
export class WordpressService extends WebsiteServiceBase {
  constructor(scope: Construct, id: string, props: WordpressServiceProps) {
    super(scope, id, {
      ...props,
      ecsExtension: new WordpressExtension(props),
    });
  }
}
