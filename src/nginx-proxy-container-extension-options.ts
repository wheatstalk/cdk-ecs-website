import * as path from 'path';
import {
  ContainerImage,
  ITaskDefinitionExtension,
  LogDriver,
  NetworkMode,
  Protocol,
  TaskDefinition,
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
   */
  readonly defaultConf: string;

  /**
   * Provides an image name to build the nginx container from. You may change
   * this base image name to 'nginx:1-perl', for instance, if you want perl
   * support in the nginx container config.
   * @default 'nginx:1'
   */
  readonly imageFrom?: string;

  /**
   * Traffic port for the proxy.
   * @default 80
   */
  readonly trafficPort?: number;

  /**
   * Name of the proxy container
   * @default 'proxy'
   */
  readonly containerName?: string;
}

/**
 * Extends a TaskDefinition by adding an nginx proxy before the workload container.
 */
export class NginxProxyContainerExtension implements ITaskDefinitionExtension {
  private readonly imageFrom: string;
  private readonly defaultConf: string;
  private readonly trafficPort: number;
  private readonly containerName: string;

  constructor(readonly options: NginxProxyContainerExtensionOptions) {
    this.imageFrom = options.imageFrom ?? 'nginx:1';
    this.defaultConf = options.defaultConf;
    this.trafficPort = options.trafficPort ?? 80;
    this.containerName = options.containerName ?? 'proxy';
  }

  extend(taskDefinition: TaskDefinition): void {
    const workloadContainer = taskDefinition.defaultContainer!;

    const proxyContainer = taskDefinition.addContainer(this.containerName, {
      image: ContainerImage.fromAsset(path.join(__dirname, '..', 'files', 'nginx-proxy'), {
        buildArgs: {
          FROM: this.imageFrom,
        },
      }),
      memoryReservationMiB: 32,
      memoryLimitMiB: 128,
      logging: LogDriver.awsLogs({ streamPrefix: 'nginx-proxy' }),
      environment: {
        CONFIG: this.defaultConf,
      },
    });

    if (taskDefinition.networkMode === NetworkMode.BRIDGE) {
      proxyContainer.addLink(workloadContainer);
    }

    proxyContainer.addPortMappings({
      protocol: Protocol.TCP,
      containerPort: this.trafficPort,
    });

    taskDefinition.defaultContainer = proxyContainer;
  }
}