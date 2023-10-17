import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps, BaseContainerState } from '../../../model/container/BaseContainer';
import ReferralPortkey from 'pages/Login/ReferralPortkey';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GStyles from 'assets/theme/GStyles';

export default class ReferralEntryPage extends BaseContainer<
  BaseContainerProps,
  BaseContainerState,
  ReferralPageResult
> {
  constructor(props: BaseContainerProps) {
    super(props);
    this.state = {};
  }

  getEntryName = (): string => PortkeyEntries.REFERRAL_ENTRY;

  render() {
    return (
      <SafeAreaProvider style={GStyles.whiteBackgroundColor}>
        <ReferralPortkey />
      </SafeAreaProvider>
    );
  }
}

export interface ReferralPageResult {}
