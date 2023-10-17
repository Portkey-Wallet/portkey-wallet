import { VerificationType } from '@portkey-wallet/types/verifier';
import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps } from '../../../model/container/BaseContainer';
import VerifierDetails from 'pages/Guardian/VerifierDetails';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AccountOriginalType } from 'model/verify/after-verify';
import { GuardianConfig } from 'model/verify/guardian';
import GStyles from 'assets/theme/GStyles';

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
    const { accountIdentifier, accountOriginalType } = guardianConfig;
    return (
      <SafeAreaProvider style={GStyles.whiteBackgroundColor}>
        <VerifierDetails
          accountIdentifier={accountIdentifier}
          accountOriginalType={accountOriginalType}
          guardianConfig={guardianConfig}
        />
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

export interface VerifierDetailsPageState {
  guardianConfig: GuardianConfig;
}

export interface VerifierDetailsPageResult {}
