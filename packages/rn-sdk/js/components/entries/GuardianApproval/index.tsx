import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps, BaseContainerState } from '../../../model/container/BaseContainer';
import GuardianApproval from 'pages/Guardian/GuardianApproval';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class GuardianApprovalEntryPage extends BaseContainer<
  BaseContainerProps,
  BaseContainerState,
  GuardianApprovalPageResult
> {
  constructor(props: BaseContainerProps) {
    super(props);
    this.state = {};
  }

  getEntryName = (): string => PortkeyEntries.GUARDIAN_APPROVAL_ENTRY;

  render() {
    return (
      <SafeAreaProvider>
        <GuardianApproval />
      </SafeAreaProvider>
    );
  }
}

export interface GuardianApprovalPageResult {}
