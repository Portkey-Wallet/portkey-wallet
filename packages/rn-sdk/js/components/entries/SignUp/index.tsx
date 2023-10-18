import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps } from '../../../model/container/BaseContainer';
import SignupPortkey from 'pages/Login/SignupPortkey';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CountryCodeItem } from 'types/wallet';
import { GlobalStorage } from 'service/storage';
import { CURRENT_USING_COUNTRY_CODE } from 'model/global';
import GStyles from 'assets/theme/GStyles';
import BaseContainerContext from 'model/container/BaseContainerContext';

export default class SignUpEntryPage extends BaseContainer<BaseContainerProps, SignUpPageState, SignUpPageResult> {
  constructor(props: BaseContainerProps) {
    super(props);
    this.state = {
      currentCountryCodeItem: null,
    };
  }

  checkMMKVStorage = async () => {
    const cache = await GlobalStorage.getString(CURRENT_USING_COUNTRY_CODE);
    cache &&
      this.setState({
        currentCountryCodeItem: cache ? JSON.parse(cache) : null,
      });
  };

  updateCountryCode = (countryCode: CountryCodeItem) => {
    this.setState({
      currentCountryCodeItem: countryCode,
    });
  };

  getEntryName = (): string => PortkeyEntries.SIGN_UP_ENTRY;

  render() {
    return (
      <SafeAreaProvider style={GStyles.whiteBackgroundColor}>
        <BaseContainerContext.Provider value={{ entryName: this.getEntryName() }}>
          <SignupPortkey
            selectedCountryCode={this.state.currentCountryCodeItem}
            updateCountryCode={this.updateCountryCode}
          />
        </BaseContainerContext.Provider>
      </SafeAreaProvider>
    );
  }
}

export interface SignUpPageState {
  currentCountryCodeItem: CountryCodeItem | null;
}

export interface SignUpPageResult {}
