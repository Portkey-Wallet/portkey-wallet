import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps, BaseContainerState } from '../../../model/container/BaseContainer';
import VerifierDetails from 'pages/Guardian/VerifierDetails';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class GuardianApprovalEntryPage extends BaseContainer<
  BaseContainerProps,
  BaseContainerState,
  VerifierDetailsPageResult
> {
  constructor(props: BaseContainerProps) {
    super(props);
    this.state = {};
  }

  getEntryName = (): string => PortkeyEntries.VERIFIER_DETAIL_ENTRY;

  render() {
    return (
      <SafeAreaProvider>
        <VerifierDetails />
      </SafeAreaProvider>
    );
  }
}

export interface VerifierDetailsPageResult {}
