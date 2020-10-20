import { Construct } from '@aws-cdk/core';

import { WebsiteServiceBase, WebsiteServiceOptions } from './website-service-base';
import { WordpressWorkload, WordpressWorkloadOptions } from './wordpress-workload';

/**
 * Props for `WordpressService`
 */
export interface WordpressServiceProps extends WebsiteServiceOptions, WordpressWorkloadOptions {}

/**
 * Create a wordpress website.
 */
export class WordpressService extends WebsiteServiceBase {
  constructor(scope: Construct, id: string, props: WordpressServiceProps) {
    super(scope, id, {
      ...props,
      ecsExtension: new WordpressWorkload(props),
    });
  }
}
