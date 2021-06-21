// Folders
import { CognitoAuthenticationConfig } from './listener-rules-builder';

/**
 * @deprecated Use CognitoAuthenticationConfig instead.
 */
export interface WebsiteServicePropsAuthWithUserPoolProps extends CognitoAuthenticationConfig {
}

export * from './ecs-workloads';
export * from './http-container-workload';
export * from './listener-rules-builder';
export * from './website-service';
export * from './website-service-base';
export * from './wordpress-workload';
export * from './wordpress-service';
export * from './nginx-proxy-container-extension-options';