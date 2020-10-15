import { IUserPool, IUserPoolClient } from '@aws-cdk/aws-cognito';
import { Construct, Fn } from '@aws-cdk/core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';

export interface CognitoAuthClientProps {
  userPool: IUserPool;
  userPoolClient: IUserPoolClient;
}

export class UserPoolClientSecretGetter extends Construct {
  public readonly clientSecret: string;

  constructor(scope: Construct, id: string, props: CognitoAuthClientProps) {
    super(scope, id);

    const clientSecretGetter = new AwsCustomResource(this, 'DescribeUserPoolClientSecret', {
      onCreate: {
        region: Fn.sub('${AWS::Partition}'),
        service: 'CognitoIdentityServiceProvider',
        action: 'describeUserPoolClient',
        parameters: {
          UserPoolId: props.userPool.userPoolId,
          ClientId: props.userPoolClient.userPoolClientId,
        },
        physicalResourceId: PhysicalResourceId.of(props.userPoolClient.userPoolClientId),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    this.clientSecret = clientSecretGetter.getResponseField('UserPoolClient.ClientSecret');
  }
}
