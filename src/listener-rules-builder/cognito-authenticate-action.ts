import { IUserPool, IUserPoolClient } from '@aws-cdk/aws-cognito';
import { ListenerAction } from '@aws-cdk/aws-elasticloadbalancingv2';

export interface CognitoAuthenticateOptions {
  userPoolClient: IUserPoolClient;
  domain: string;
  userPool: IUserPool;
}

export class CognitoAuthenticateAction extends ListenerAction {
  constructor(userPoolInfo: CognitoAuthenticateOptions, next: ListenerAction) {
    const actionJson = {
      authenticateCognitoConfig: {
        userPoolArn: userPoolInfo.userPool.userPoolArn,
        userPoolClientId: userPoolInfo.userPoolClient.userPoolClientId,
        userPoolDomain: userPoolInfo.domain,
      },
      type: 'authenticate-cognito',
    };
    super(actionJson, next);
  }
}
