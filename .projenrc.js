const { AwsCdkConstructLibrary, Semver, GithubWorkflow } = require('projen');

const project = new AwsCdkConstructLibrary({
  authorAddress: "joshkellendonk@gmail.com",
  authorName: "Josh Kellendonk",
  license: "MIT",
  jsiiVersion: '^1.13.0',
  name: "@wheatstalk/cdk-ecs-website",
  repository: "git@github.com:wheatstalk/cdk-ecs-website.git",
  releaseEveryCommit: false,
  gitignore: [
    ".idea",
    "*.iml",
    "cdk.out.*",
  ],
  devDeps: [
    "@types/fs-extra@^8.1.0",
    "@types/json-diff@^0.5.0",
    "json-diff@^0.5.4",
    "ts-node@^9.0.0",
    "yargs@^16.1.0",
  ],
  bundledDeps: [
    "fs-extra",
  ],
  deps: [
    "fs-extra@^8.1.0",
  ],
  cdkVersion: "1.68.0",
  cdkTestDependencies: [
    "aws-cdk",
    "@aws-cdk/assert",
    "@aws-cdk/aws-rds",
  ],
  cdkDependencies: [
    "@aws-cdk/aws-cognito",
    "@aws-cdk/aws-ec2",
    "@aws-cdk/aws-efs",
    "@aws-cdk/aws-ecs",
    "@aws-cdk/aws-secretsmanager",
    "@aws-cdk/aws-elasticloadbalancingv2",
    "@aws-cdk/aws-elasticloadbalancingv2-targets",
    "@aws-cdk/aws-logs",
    "@aws-cdk/core",
  ],
  npmignore: ['node_modules'],
  compat: true,
});

const yarnUp = new GithubWorkflow(project, 'yarn-upgrade');

yarnUp.on({
  schedule: [{ cron: '0 6 * * *'}],
  workflow_dispatch: {},
});

yarnUp.addJobs({
  upgrade: {
    'name': 'Yarn Upgrade',
    'runs-on': 'ubuntu-latest',
    'steps': [
      { uses: 'actions/checkout@v2' },
      { run: 'yarn upgrade' },
      { run: 'git diff' },
      { run: 'CI="" npx projen' },
      { run: 'yarn build' },
      {
        name: 'Create Pull Request',
        uses: 'peter-evans/create-pull-request@v3',
        with: {
          'title': 'chore: automatic yarn upgrade',
          'commit-message': 'chore: automatic yarn upgrade',
          'token': '${{ secrets.YARN_UPGRADE_TOKEN }}',
        },
      },
    ],
  },
});

project.mergify.addRule({
  name: 'Merge pull requests automatic yarn upgrade if CI passes',
  conditions: [
    "head=create-pull-request/patch",
    "status-success=build",
  ],
  actions: {
    merge: {
      method: 'merge',
      commit_message: 'title+body',
    },
  },
});

project.synth();
