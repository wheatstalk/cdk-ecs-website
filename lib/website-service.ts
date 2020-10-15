import { ContainerImage, Secret } from '@aws-cdk/aws-ecs';
import { Construct } from '@aws-cdk/core';

import { HttpContainerExtension } from './http-container-extension';
import { WebsiteServiceBase, WebsiteServiceOptions } from './website-service-base';

export interface WebsiteServiceProps extends WebsiteServiceOptions {
  /**
   * The main container image
   */
  containerImage: ContainerImage;

  /**
   * Desired task count
   * @default 1
   */
  desiredCount?: number;

  /**
   * The the main container port to expose by load balancer.
   * @default 80
   * */
  containerPort?: number;

  /**
   * Specify environment variables for the main container
   */
  envVars?: Record<string, string>;

  /**
   * Specify environment variables from secrets for the main container
   */
  envSecrets?: Record<string, Secret>;
}

/**
 * Create a website service.
 */
export class WebsiteService extends WebsiteServiceBase {
  constructor(scope: Construct, id: string, props: WebsiteServiceProps) {
    super(scope, id, {
      ...props,
      ecsExtension: new HttpContainerExtension({
        containerImage: props.containerImage,
        trafficPort: props.containerPort,
        envVars: props.envVars,
        envSecrets: props.envSecrets,
      }),
    });
  }
}
