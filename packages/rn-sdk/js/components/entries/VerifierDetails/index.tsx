import { VerificationType } from '@portkey-wallet/types/verifier';
import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps, BaseContainerState } from '../../../model/container/BaseContainer';
import VerifierDetails from 'pages/Guardian/VerifierDetails';
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AccountOriginalType } from 'model/verify/after-verify';

export default class VerifierDetailsEntryPage extends BaseContainer<
  VerifierDetailsPageProps,
  BaseContainerState,
  VerifierDetailsPageResult
> {
  constructor(props: VerifierDetailsPageProps) {
    super(props);
    this.state = {};
  }

  getEntryName = (): string => PortkeyEntries.VERIFIER_DETAIL_ENTRY;

  render() {
    const { accountIdentifier, accountOriginalType } = this.props;
    return (
      <SafeAreaProvider>
        <VerifierDetails accountIdentifier={accountIdentifier} accountOriginalType={accountOriginalType} />
      </SafeAreaProvider>
    );
  }
}

export interface VerifierDetailsPageProps extends BaseContainerProps {
  verificationType: VerificationType;
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
  deliveredGuardianInfo: string; // GuardianConfig
}

export interface VerifierDetailsPageResult {}
