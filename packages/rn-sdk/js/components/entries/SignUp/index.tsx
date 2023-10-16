import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps } from '../../../model/container/BaseContainer';
import SignupPortkey from 'pages/Login/SignupPortkey';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CountryCodeItem } from 'types/wallet';
import { GlobalStorage } from 'service/storage';
import { CURRENT_USING_COUNTRY_CODE } from 'model/global';

export default class SignUpEntryPage extends BaseContainer<BaseContainerProps, SignUpPageState, SignUpPageResult> {
  constructor(props: BaseContainerProps) {
    super(props);
  }

  checkMMKVStorage = async () => {
    const cache = await GlobalStorage.getString(CURRENT_USING_COUNTRY_CODE);
    this.state = {
      currentCountryCodeItem: cache ? JSON.parse(cache) : null,
    };
  };

  updateCountryCode = (countryCode: CountryCodeItem) => {
    this.setState({
      currentCountryCodeItem: countryCode,
    });
  };

  getEntryName = (): string => PortkeyEntries.SIGN_UP_ENTRY;

  render() {
    return (
      <SafeAreaProvider>
        <SignupPortkey
          selectedCountryCode={this.state.currentCountryCodeItem}
          updateCountryCode={this.updateCountryCode}
        />
      </SafeAreaProvider>
    );
  }
}

export interface SignUpPageState {
  currentCountryCodeItem: CountryCodeItem | null;
}

export interface SignUpPageResult {}
