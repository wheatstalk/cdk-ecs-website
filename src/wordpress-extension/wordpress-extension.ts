import { IConnectable, Port } from '@aws-cdk/aws-ec2';
import { Ec2Service, FargateService, LogDriver, Secret } from '@aws-cdk/aws-ecs';
import { IFileSystem } from '@aws-cdk/aws-efs';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { ISecret } from '@aws-cdk/aws-secretsmanager';

import { IEcsExtension, TaskDefinitionBindingInfo } from '../ecs-extensions';
import { createWordpressImage } from './create-wordpress-image';

/**
 * Configuration options for building the WordPress container image.
 */
export interface CreateImageOptions {
  /**
   * PHP container to build the container from.
   *
   * @default 'php:7-apache'
   */
  readonly from?: string;

  /**
   * Provide a WordPress version to download. The default is to download
   * the latest WordPress version. If you specify `wordpressSourcePath`,
   * your source code will be used instead.
   *
   * @default 'latest'
   */
  readonly wordpressVersion?: string;

  /**
   * Provide your own WordPress sources. When you specify this option,
   * your source code will be used instead of
   */
  readonly wordpressSourcePath?: string;
}

/**
 * Props for `WordpressExtension`
 */
export interface WordpressExtensionOptions {
  /**
   * Credentials for accessing the database server. We expect the standard
   * RDS json secret format.
   */
  readonly databaseSecret: ISecret;

  /**
   * A filesystem in which to put the user uploads.
   */
  readonly fileSystem: IFileSystem;

  /**
   * A location on the filesystem to mount as the data volume root. In the case
   * that you are sharing one EFS FileSystem for multiple sites, you might use
   * the site name as a convention for choosing the directory.
   * @default '/'
   */
  readonly fileSystemRootDirectory?: string;

  /**
   * Options building the Wordpress container.
   */
  readonly wordpressImageOptions?: CreateImageOptions;

  /**
   * Name of the database containing the Wordpress site.
   */
  readonly wordpressDatabaseName?: string;

  /**
   * When provided, an ingress rule will be added to the filesystem's security
   * group so that ECS can mount the file system. You probably want this, but
   * it is disabled by default for security reasons.
   */
  readonly fileSystemConnection?: IConnectable;

  /**
   * When provided, an ingress rule will be added to the database's security
   * group so that ECS can connect to the database. You probably want this, but
   * it is disabled by default for security reasons.
   */
  readonly databaseConnection?: IConnectable;
}

/**
 * Provides an opinionated ECS-hosted website workload.
 */
export class WordpressExtension implements IEcsExtension {
  public readonly trafficContainer = 'web';
  public readonly trafficPort = 80;

  constructor(private readonly props: WordpressExtensionOptions) {
  }

  useTaskDefinition(taskDefinitionInfo: TaskDefinitionBindingInfo): void {
    const { taskDefinition } = taskDefinitionInfo;

    const props = this.props;
    const volumeName = 'files';

    taskDefinition.addVolume({
      name: volumeName,
      efsVolumeConfiguration: {
        fileSystemId: props.fileSystem.fileSystemId,
        rootDirectory: props.fileSystemRootDirectory,
      },
    });

    const environment: Record<string, string> = {};

    if (props.wordpressDatabaseName) {
      environment.WORDPRESS_DB_NAME = props.wordpressDatabaseName;
    }

    const webContainer = taskDefinition.addContainer(this.trafficContainer, {
      image: createWordpressImage(props.wordpressImageOptions),
      memoryReservationMiB: taskDefinitionInfo.taskMemoryReserved,
      memoryLimitMiB: taskDefinitionInfo.taskMemoryLimit,
      logging: LogDriver.awsLogs({
        streamPrefix: 'WordpressExtension',
        logRetention: RetentionDays.ONE_MONTH,
      }),
      environment: environment,
      secrets: {
        WORDPRESS_DB_SECRET: Secret.fromSecretsManager(props.databaseSecret),
      },
    });

    webContainer.addPortMappings({
      containerPort: this.trafficPort,
    });

    webContainer.addMountPoints({
      readOnly: false,
      sourceVolume: volumeName,
      containerPath: '/data',
    });
  }

  useService(service: Ec2Service | FargateService): void {
    this.props.databaseConnection?.connections.allowFrom(service, Port.allTraffic());
    this.props.fileSystemConnection?.connections.allowFrom(service, Port.allTraffic());
  }
}
