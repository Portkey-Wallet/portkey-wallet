import { OperationTypeEnum, VerificationType } from '@portkey-wallet/types/verifier';
import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps } from '../../../model/container/BaseContainer';
import VerifierDetails from 'pages/Guardian/VerifierDetails';
import React from 'react';
import { AccountOriginalType } from 'model/verify/core';
import { GuardianConfig } from 'model/verify/guardian';

export default class VerifierDetailsEntryPage extends BaseContainer<
  VerifierDetailsPageProps,
  VerifierDetailsPageState,
  VerifierDetailsPageResult
> {
  constructor(props: VerifierDetailsPageProps) {
    super(props);
    const { deliveredGuardianInfo } = props;
    if (!deliveredGuardianInfo) throw new Error('guardianConfig is null!');
    this.state = {
      guardianConfig: JSON.parse(deliveredGuardianInfo),
    };
  }

  getEntryName = (): string => PortkeyEntries.VERIFIER_DETAIL_ENTRY;

  render() {
    const { guardianConfig } = this.state;
    const { operationType = OperationTypeEnum.unknown } = this.props;
    const { accountIdentifier, accountOriginalType } = guardianConfig;
    return (
      <VerifierDetails
        accountIdentifier={accountIdentifier}
        accountOriginalType={accountOriginalType}
        guardianConfig={guardianConfig}
        operationType={operationType}
      />
    );
  }
}

export interface VerifierDetailsPageProps extends BaseContainerProps {
  verificationType: VerificationType;
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
  deliveredGuardianInfo: string; // GuardianConfig
  operationType: OperationTypeEnum;
}

export interface VerifierDetailsPageState {
  guardianConfig: GuardianConfig;
}

export interface VerifierDetailsPageResult {
  verifiedData: string; // CheckVerifyCodeResultDTO
}
