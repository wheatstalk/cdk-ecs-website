import { IUserPool, IUserPoolClient } from '@aws-cdk/aws-cognito';
import { CfnListener, IApplicationTargetGroup } from '@aws-cdk/aws-elasticloadbalancingv2';

import ActionProperty = CfnListener.ActionProperty;

export interface UserPoolInfo {
  userPoolClient: IUserPoolClient;
  domain: string;
  userPool: IUserPool;
}

export class ServingActionsBuilder {
  public userPoolInfo?: UserPoolInfo

  constructor(private targetGroup: IApplicationTargetGroup) {
  }

  buildInner(): ActionProperty[] {
    if (this.userPoolInfo) {
      return [
        this.getUserPoolAction(),
        this.getForwardAction(),
      ];
    }

    return [this.getForwardAction()];
  }

  build(): ActionProperty[] {
    return this.buildInner()
      // Add an order key by array index number.
      .map((a, index) => ({
        ...a,
        order: index + 1,
      }));
  }

  private getForwardAction(): ActionProperty {
    return {
      targetGroupArn: this.targetGroup.targetGroupArn,
      type: 'forward',
    };
  }

  private getUserPoolAction() {
    if (!this.userPoolInfo) {
      throw new Error('Can\'t create user pool action because we don\'t have a user pool');
    }

    return {
      authenticateCognitoConfig: {
        userPoolArn: this.userPoolInfo.userPool.userPoolArn,
        userPoolClientId: this.userPoolInfo.userPoolClient.userPoolClientId,
        userPoolDomain: this.userPoolInfo.domain,
      },
      type: 'authenticate-cognito',
    };
  }
}
