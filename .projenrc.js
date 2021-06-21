const { AwsCdkConstructLibrary, GithubWorkflow, DependenciesUpgradeMechanism, Semver } = require('projen');

const project = new AwsCdkConstructLibrary({
  name: '@wheatstalk/cdk-ecs-website',
  description: 'CDK ECS Website Constructs',
  jsiiVersion: Semver.caret('1.7.0'),
  authorName: 'Josh Kellendonk',
  authorEmail: 'joshkellendonk@gmail.com',
  repository: 'git@github.com:wheatstalk/cdk-ecs-website.git',
  license: 'MIT',

  projenUpgradeSecret: 'YARN_UPGRADE_TOKEN',
  depsUpgrade: DependenciesUpgradeMechanism.githubWorkflow(),

  defaultReleaseBranch: 'master',
  releaseEveryCommit: false,

  gitignore: [
    '.idea',
    '*.iml',
    'cdk.out.*',
  ],

  devDeps: [
    '@types/fs-extra@^8.1.0',
    '@types/json-diff@^0.5.0',
    'json-diff@^0.5.4',
    'ts-node@^9.0.0',
    'yargs@^16.1.0',
  ],
  bundledDeps: [
    'fs-extra',
  ],
  deps: [
    'fs-extra@^8.1.0',
  ],

  cdkVersion: '1.68.0',
  cdkTestDependencies: [
    'aws-cdk',
    '@aws-cdk/assert',
    '@aws-cdk/aws-rds',
  ],
  cdkDependencies: [
    '@aws-cdk/aws-cognito',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-efs',
    '@aws-cdk/aws-ecs',
    '@aws-cdk/aws-secretsmanager',
    '@aws-cdk/aws-elasticloadbalancingv2',
    '@aws-cdk/aws-elasticloadbalancingv2-targets',
    '@aws-cdk/aws-logs',
    '@aws-cdk/core',
  ],
  npmignore: ['node_modules'],
  compat: true,
});

project.synth();
