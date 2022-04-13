const { awscdk, release } = require('projen');

const cdkDependencies = [
  '@aws-cdk/aws-cognito',
  '@aws-cdk/aws-ec2',
  '@aws-cdk/aws-efs',
  '@aws-cdk/aws-ecs',
  '@aws-cdk/aws-secretsmanager',
  '@aws-cdk/aws-elasticloadbalancingv2',
  '@aws-cdk/aws-elasticloadbalancingv2-targets',
  '@aws-cdk/aws-logs',
  '@aws-cdk/core',
];

const project = new awscdk.AwsCdkConstructLibrary({
  name: '@wheatstalk/cdk-ecs-website',
  description: 'CDK ECS Website Constructs',
  authorName: 'Josh Kellendonk',
  authorEmail: 'joshkellendonk@gmail.com',
  repository: 'git@github.com:wheatstalk/cdk-ecs-website.git',
  license: 'MIT',

  cdkVersion: '1.68.0',
  cdkDependenciesAsDeps: false, // https://dev.to/aws-builders/correctly-defining-dependencies-in-l3-cdk-constructs-45p#update-20210417

  cdkDependencies: cdkDependencies,
  cdkTestDependencies: [
    'aws-cdk',
    '@aws-cdk/assert',
    '@aws-cdk/aws-rds',
  ].concat(cdkDependencies),

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

  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ['misterjoshua'],
  },

  defaultReleaseBranch: 'main',
  releaseTrigger: release.ReleaseTrigger.manual(),

  compat: true,

  gitignore: [
    '.idea',
    '*.iml',
    'cdk.out.*',
  ],
});

project.synth();
