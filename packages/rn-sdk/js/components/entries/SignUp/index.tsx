import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps, BaseContainerState } from '../../../model/container/BaseContainer';
import SignupPortkey from 'pages/Login/SignupPortkey';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class SignUpEntryPage extends BaseContainer<BaseContainerProps, BaseContainerState, SignUpPageResult> {
  constructor(props: BaseContainerProps) {
    super(props);
    this.state = {};
  }

  getEntryName = (): string => PortkeyEntries.SIGN_UP_ENTRY;

  render() {
    return (
      <SafeAreaProvider>
        <SignupPortkey />
      </SafeAreaProvider>
    );
  }
}

export interface SignUpPageResult {}
