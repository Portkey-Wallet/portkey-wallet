import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import BaseContainer, { BaseContainerProps, BaseContainerState } from '../../../model/container/BaseContainer';
import SignInPortkey from 'pages/Login/LoginPortkey';
import React from 'react';
import BaseContainerContext from 'model/container/BaseContainerContext';
import { CountryCodeItem } from 'types/wallet';
import { GlobalStorage } from 'service/storage';
import { CURRENT_USING_COUNTRY_CODE } from '../../../model/global';

export default class SignInEntryPage extends BaseContainer<SignInPageProps, SignInPageState, SignInPageResult> {
  constructor(props: BaseContainerProps) {
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

  render() {
    return (
      <>
        <BaseContainerContext.Provider value={{ entryName: this.getEntryName() }}>
          <SignInPortkey />
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
