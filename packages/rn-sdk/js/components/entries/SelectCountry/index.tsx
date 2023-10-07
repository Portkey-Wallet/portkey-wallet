import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps, BaseContainerState } from '../../../model/container/BaseContainer';
import { AccountCheckResult, attemptAccountCheck } from '../../../model/sign-in';
import SelectCountry from 'pages/Login/SelectCountry';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class SelectCountryEntryPage extends BaseContainer<
  BaseContainerProps,
  BaseContainerState,
  SelectCountryPageResult
> {
  constructor(props: BaseContainerProps) {
    super(props);
    this.state = {};
  }

  getEntryName = (): string => PortkeyEntries.SELECT_COUNTRY_ENTRY;

  attemptAccountCheck = async (accountIdentifier: string): Promise<AccountCheckResult> => {
    return attemptAccountCheck(accountIdentifier);
  };

  render() {
    return (
      <SafeAreaProvider>
        <SelectCountry />
      </SafeAreaProvider>
    );
  }
}

export interface SelectCountryPageResult {}
