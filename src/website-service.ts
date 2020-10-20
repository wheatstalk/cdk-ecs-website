import { ContainerImage, Secret } from '@aws-cdk/aws-ecs';
import { Construct } from '@aws-cdk/core';

import { HttpContainerWorkload } from './http-container-workload';
import { WebsiteServiceBase, WebsiteServiceOptions } from './website-service-base';

/**
 * Props for `WebsiteService`
 */
export interface WebsiteServiceProps extends WebsiteServiceOptions {
  /**
   * The main container image
   */
  readonly containerImage: ContainerImage;

  /**
   * The the main container port to expose by load balancer.
   * @default 80
   * */
  readonly containerPort?: number;

  /**
   * Specify environment variables for the main container
   */
  readonly envVars?: Record<string, string>;

  /**
   * Specify environment variables from secrets for the main container
   */
  readonly envSecrets?: Record<string, Secret>;
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
        trafficPort: props.containerPort,
        envVars: props.envVars,
        envSecrets: props.envSecrets,
      }),
    });
  }
}
