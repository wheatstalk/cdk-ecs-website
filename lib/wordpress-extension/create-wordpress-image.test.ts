import { Compatibility, TaskDefinition } from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';
import * as fs from 'fs-extra';
import * as path from 'path';

import { createUserSourceBuildContext, createWordpressImage } from './create-wordpress-image';

const WP_TEST_FIXTURE_PATH = path.join(__dirname, 'test-fixtures', 'wp');

it('creates a build context', () => {
  const buildContext = createUserSourceBuildContext(WP_TEST_FIXTURE_PATH);

  fs.existsSync(path.join(buildContext, 'Dockerfile'));
  fs.existsSync(path.join(buildContext, 'wordpress', 'index.php'));
});

it('generates a container image that works with task definitions', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack');

  const taskDefinition = new TaskDefinition(stack, 'Task', {
    compatibility: Compatibility.EC2_AND_FARGATE,
    cpu: '256',
    memoryMiB: '512',
  });

  taskDefinition.addContainer('main', {
    image: createWordpressImage(),
    memoryLimitMiB: 512,
  });

  const assembly = app.synth();
  const assetName = fs.readdirSync(assembly.directory).find((s) => s.match(/^asset\./));
  const assetDir = path.join(assembly.directory, assetName ?? '');

  expect(fs.existsSync(path.join(assetDir, 'Dockerfile'))).toBeTruthy();
  expect(fs.existsSync(path.join(assetDir, 'wordpress'))).toBeFalsy();
});

it('builds a container from user sources', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack');

  const taskDefinition = new TaskDefinition(stack, 'Task', {
    compatibility: Compatibility.EC2_AND_FARGATE,
    cpu: '256',
    memoryMiB: '512',
  });

  taskDefinition.addContainer('main', {
    image: createWordpressImage({
      wordpressSourcePath: WP_TEST_FIXTURE_PATH,
    }),
    memoryLimitMiB: 512,
  });

  const assembly = app.synth();
  const assetName = fs.readdirSync(assembly.directory).find((s) => s.match(/^asset\./));
  const assetDir = path.join(assembly.directory, assetName ?? '');

  expect(fs.existsSync(path.join(assetDir, 'Dockerfile'))).toBeTruthy();
  expect(fs.existsSync(path.join(assetDir, 'wordpress', 'index.php'))).toBeTruthy();
});
