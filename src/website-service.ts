import { Construct } from '@aws-cdk/core';

import { HttpContainerWorkload, HttpContainerWorkloadProps } from './http-container-workload';
import { WebsiteServiceBase, WebsiteServiceOptions } from './website-service-base';

/**
 * Props for `WebsiteService`
 */
export interface WebsiteServiceProps extends WebsiteServiceOptions, HttpContainerWorkloadProps {
}

/**
 * Create a website from an http-serving container.
 */
export class WebsiteService extends WebsiteServiceBase {
  constructor(scope: Construct, id: string, props: WebsiteServiceProps) {
    super(scope, id, {
      ...props,
      ecsExtension: new HttpContainerWorkload({
        containerImage: props.containerImage,
        containerPort: props.containerPort,
        envVars: props.envVars,
        envSecrets: props.envSecrets,
      }),
    });
  }
}
