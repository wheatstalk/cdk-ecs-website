import * as os from 'os';
import * as path from 'path';
import * as ecs from '@aws-cdk/aws-ecs';
import * as fs from 'fs-extra';
import { WordpressImageOptions } from './wordpress-workload';

export function renderWordpressZipUrl(version: string): string {
  return `https://wordpress.org/wordpress-${version}.zip`;
}

const CONTEXT_STARTER_PATH = path.normalize(path.join(__dirname, '..', '..', 'files', 'wordpress'));
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

export function createWordpressImage(options?: WordpressImageOptions): ecs.ContainerImage {
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

  return ecs.ContainerImage.fromAsset(buildContext, {
    file: 'Dockerfile',
    buildArgs: {
      FROM: from,
      DOWNLOAD: renderWordpressZipUrl(wordpressVersion),
    },
  });
}
