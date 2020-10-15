import { ContainerImage } from '@aws-cdk/aws-ecs';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';

export function renderWordpressZipUrl(version: string): string {
  return `https://wordpress.org/wordpress-${version}.zip`;
}

const CONTEXT_STARTER_PATH = path.join(__dirname, 'docker-build');
const CONTEXT_CODE_SUBPATH = 'wordpress';

export function createUserSourceBuildContext(userSourcePath: string): string {
  // Create a context directory from which to build the image.
  const buildContext = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-wordpress-'));
  const buildContextCodePath = path.join(buildContext, CONTEXT_CODE_SUBPATH);

  // Copy in the user code
  fs.copySync(userSourcePath, buildContextCodePath);

  // Copy in the supporting files for the image build
  fs.copySync(CONTEXT_STARTER_PATH, path.join(buildContext, '.'));

  return buildContext;
}

export interface CreateImageOptions {
  /**
   * PHP container to build the container from.
   *
   * @default 'php:7-apache'
   */
  from?: string;

  /**
   * Provide a WordPress version to download. The default is to download
   * the latest WordPress version. If you specify `wordpressSourcePath`,
   * your source code will be used instead.
   *
   * @default 'latest'
   */
  wordpressVersion?: string;

  /**
   * Provide your own WordPress sources. When you specify this option,
   * your source code will be used instead of
   */
  wordpressSourcePath?: string;
}

export function createWordpressImage(options?: CreateImageOptions): ContainerImage {
  if (options?.wordpressVersion && options?.wordpressSourcePath) {
    throw new Error('cannot specify both `downloadWordpressVersion` and `wordpressSourcePath`');
  }

  const from = options?.from ?? 'php:7-apache';
  const wordpressVersion = options?.wordpressVersion ?? 'latest';

  let buildContext: string;
  if (options?.wordpressSourcePath) {
    // When the user provides their code, we need to create a docker build
    // context for them that combines our docker tooling with their code.
    buildContext = createUserSourceBuildContext(options.wordpressSourcePath);
  } else {
    // Otherwise, we'll be downloading Wordpress for the user, so no special
    // docker build context is necessary.
    buildContext = CONTEXT_STARTER_PATH;
  }

  return ContainerImage.fromAsset(buildContext, {
    file: 'Dockerfile',
    buildArgs: {
      FROM: from,
      DOWNLOAD: renderWordpressZipUrl(wordpressVersion),
    },
  });
}
