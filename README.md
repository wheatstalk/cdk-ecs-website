# CDK ECS Website Construct

This simple construct creates an ECS service following a shared ALB pattern. It has the following features:

- Creates an ECS service
- Creates an ALB target group
- Registers the target group with ALB listeners using host-header-based listener rules.
- Supports redirection to the primary host name of the service based on ALB listener rules.
- Supports Cognito UserPool-based authentication for dev sites use.

## Installation

```
yarn add -D @wheatstalk/cdk-ecs-website
```