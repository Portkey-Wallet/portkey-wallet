import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps } from '../../../model/container/BaseContainer';
import SignupPortkey from 'pages/Login/SignupPortkey';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CountryCodeItem } from 'types/wallet';
import { GlobalStorage } from 'service/storage';
import { CURRENT_USING_COUNTRY_CODE } from 'model/sign-in';

export default class SignUpEntryPage extends BaseContainer<BaseContainerProps, SignUpPageState, SignUpPageResult> {
  constructor(props: BaseContainerProps) {
    super(props);
    this.state = {
      currentCountryCodeItem: null,
    };
  }

  onShow(): void {
    const cache = GlobalStorage.getString(CURRENT_USING_COUNTRY_CODE);
    if (cache) {
      this.setState({
        currentCountryCodeItem: JSON.parse(cache) as CountryCodeItem,
      });
    }
  }

  getEntryName = (): string => PortkeyEntries.SIGN_UP_ENTRY;

  render() {
    return (
      <SafeAreaProvider>
        <SignupPortkey selectedCountryCode={this.state.currentCountryCodeItem} />
      </SafeAreaProvider>
    );
  }
}

export interface SignUpPageState {
  currentCountryCodeItem: CountryCodeItem | null;
}

export interface SignUpPageResult {}
