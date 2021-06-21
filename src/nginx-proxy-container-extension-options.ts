import * as path from 'path';
import {
  ContainerImage,
  ITaskDefinitionExtension,
  LogDriver,
  NetworkMode,
  Protocol,
  TaskDefinition
} from '@aws-cdk/aws-ecs';

/**
 * Options for `NginxProxyContainerExtension`
 * @experimental
 */
export interface NginxProxyContainerExtensionOptions {
  /**
   * Provides `default.conf` configuration for an nginx container that is added
   * to the task as the default, traffic-serving container. You may use this
   * feature to create a reverse proxy for your workload.
   * @default - does not use a reverse proxy
   * @experimental
   */
  readonly nginxContainerImageFrom?: string;

  /**
   * Provides an image name to build the nginx container from. You may change
   * this base image name to 'nginx:1-perl', for instance, if you want perl
   * support in the nginx container config.
   * @default 'nginx:1'
   * @experimental
   */
  readonly nginxContainerConfig: string;
}

/**
 * Extends a TaskDefinition by adding an nginx proxy before the workload
 * container.
 * @experimental
 */
export class NginxProxyContainerExtension implements ITaskDefinitionExtension {
  private readonly nginxContainerImageFrom: string;
  private readonly nginxContainerConfig: string;

  constructor(readonly options: NginxProxyContainerExtensionOptions) {
    this.nginxContainerImageFrom = options.nginxContainerImageFrom ?? 'nginx:1';
    this.nginxContainerConfig = options.nginxContainerConfig;
  }

  extend(taskDefinition: TaskDefinition): void {
    const workloadContainer = taskDefinition.defaultContainer!;

    const proxyContainer = taskDefinition.addContainer('proxy', {
      image: ContainerImage.fromAsset(path.join(__dirname, '..', 'files', 'nginx-proxy'), {
        buildArgs: {
          FROM: this.nginxContainerImageFrom,
        },
      }),
      memoryReservationMiB: 32,
      memoryLimitMiB: 128,
      logging: LogDriver.awsLogs({ streamPrefix: 'nginx-proxy' }),
      environment: {
        CONFIG: this.nginxContainerConfig,
      },
    });

    if (taskDefinition.networkMode === NetworkMode.BRIDGE) {
      proxyContainer.addLink(workloadContainer);
    }

    proxyContainer.addPortMappings({
      protocol: Protocol.TCP,
      containerPort: 80,
    });

    taskDefinition.defaultContainer = proxyContainer;
  }
}