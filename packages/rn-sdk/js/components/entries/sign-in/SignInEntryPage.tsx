import { CountryCodeItem } from 'types/wallet';
import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps, BaseContainerState } from '../../../model/container/BaseContainer';
import { AccountCheckResult, CURRENT_USING_COUNTRY_CODE, attemptAccountCheck } from '../../../model/sign-in';
import LoginPortkey from 'pages/Login/LoginPortkey';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalStorage } from 'service/storage';

export default class SignInEntryPage extends BaseContainer<SignInPageProps, SignInPageState, SignInPageResult> {
  constructor(props: SignInPageProps) {
    super(props);
    this.state = {
      useSignIn: false,
      accountIdentifierType: AccountIdentifierType.PHONE_NUMBER,
      enableSubmitButton: false,
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

  getEntryName = (): string => PortkeyEntries.SIGN_IN_ENTRY;

  attemptAccountCheck = async (accountIdentifier: string): Promise<AccountCheckResult> => {
    return attemptAccountCheck(accountIdentifier);
  };

  render() {
    return (
      <SafeAreaProvider>
        <LoginPortkey />
      </SafeAreaProvider>
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
