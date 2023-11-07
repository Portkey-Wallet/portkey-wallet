import { CountryCodeItem } from 'types/wallet';
import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps, BaseContainerState } from '../../../model/container/BaseContainer';
import { AccountCheckResult, CURRENT_USING_COUNTRY_CODE, attemptAccountCheck } from '../../../model/global';
import LoginPortkey from 'pages/Login/LoginPortkey';
import React from 'react';
import { GlobalStorage } from 'service/storage';
import BaseContainerContext from 'model/container/BaseContainerContext';

export default class SignInEntryPage extends BaseContainer<SignInPageProps, SignInPageState, SignInPageResult> {
  constructor(props: SignInPageProps) {
    super(props);
    this.checkMMKVStorage();
    this.state = {
      currentCountryCodeItem: null,
      useSignIn: false,
      accountIdentifierType: AccountIdentifierType.PHONE_NUMBER,
      enableSubmitButton: false,
    };
  }

  checkMMKVStorage = async () => {
    const cache = await GlobalStorage.getString(CURRENT_USING_COUNTRY_CODE);
    cache &&
      this.setState({
        currentCountryCodeItem: JSON.parse(cache),
      });
  };

  updateCountryCode = (countryCode: CountryCodeItem) => {
    this.setState({
      currentCountryCodeItem: countryCode,
    });
  };

  getEntryName = (): string => PortkeyEntries.SIGN_IN_ENTRY;

  attemptAccountCheck = async (accountIdentifier: string): Promise<AccountCheckResult> => {
    return attemptAccountCheck(accountIdentifier);
  };

  render() {
    return (
      <>
        <BaseContainerContext.Provider value={{ entryName: this.getEntryName() }}>
          <LoginPortkey
            selectedCountryCode={this.state.currentCountryCodeItem}
            updateCountryCode={this.updateCountryCode}
          />
        </BaseContainerContext.Provider>
      </>
    );
  }
}

export interface SignInPageProps extends BaseContainerProps {}

export interface SignInPageState extends BaseContainerState {
  useSignIn: boolean;
  accountIdentifierType: AccountIdentifierType;
  enableSubmitButton: boolean;
  currentCountryCodeItem: CountryCodeItem | null;
}

export enum AccountIdentifierType {
  PHONE_NUMBER = 0,
  EMAIL = 1,
}

export interface SignInPageResult {}
