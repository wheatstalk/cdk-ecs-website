import { IConnectable, Port } from '@aws-cdk/aws-ec2';
import { Ec2Service, FargateService, LogDriver, Secret } from '@aws-cdk/aws-ecs';
import { IFileSystem } from '@aws-cdk/aws-efs';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { ISecret } from '@aws-cdk/aws-secretsmanager';

import { EcsExtension, TaskDefinitionBindingInfo } from '../ecs-extensions';
import { CreateImageOptions, createWordpressImage } from './create-wordpress-image';

export interface WordpressExtensionOptions {
  databaseSecret: ISecret;
  fileSystem: IFileSystem;
  fileSystemRootDirectory?: string;
  wordpressImageOptions?: CreateImageOptions;
  wordpressDatabaseName?: string;
  fileSystemConnection?: IConnectable;
  databaseConnection?: IConnectable;
}

export class WordpressExtension implements EcsExtension {
  constructor(private readonly props: WordpressExtensionOptions) {}

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

    const webContainer = taskDefinition.addContainer(this.getTrafficContainer(), {
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
      containerPort: this.getTrafficPort(),
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

  getTrafficContainer(): string {
    return 'web';
  }

  getTrafficPort(): number {
    return 80;
  }
}
