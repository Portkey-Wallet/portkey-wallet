import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { PortkeyEntries } from '../../config/entries';
import BaseContainer, { BaseContainerProps, BaseContainerState } from '../../model/container/BaseContainer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonWrapper: {
    height: 50,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderColor: 'grey',
    borderWidth: 1,
    marginHorizontal: 16,
  },
  touchable: {
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    lineHeight: 32,
    fontFamily: 'PingFangSC-Regular',
  },
  hello: {
    fontSize: 20,
    textAlign: 'center',
    color: '#6c928c',
    margin: 10,
    backgroundColor: 'yellow',
  },
});

export default class LoginPage extends BaseContainer<LoginPageProps, LoginPageState, LoginResult> {
  constructor(props) {
    super(props);
    this.state = {
      hasLogin: false,
    };
  }

  getEntryName(): string {
    return PortkeyEntries.LOGIN;
  }

  render = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.hello}>{this.getCurrentLoginState()}</Text>
        <TouchableHighlight onPress={this.onLogin} style={styles.touchable}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>{'Login as Chara =)'}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.navigateBackWithResult} style={styles.touchable}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>{'Go back'}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  getCurrentLoginState = (): string => {
    const { hasLogin } = this.state;
    return hasLogin ? 'Login succeed : as Chara =)' : 'Not Login yet';
  };

  onLogin = () => {
    this.setState({ hasLogin: true });
  };

  navigateBackWithResult = () => {
    const { hasLogin } = this.state;
    if (hasLogin) {
      this.onFinish({
        result: { name: 'Chara', age: 18, friends: ['Frisk', 'Flowey'] },
        status: 'success',
      });
    } else {
      this.onError(new Error('Login failed'));
    }
  };
}

export interface LoginPageProps extends BaseContainerProps {}

export interface LoginPageState extends BaseContainerState {
  hasLogin: boolean;
}

export interface LoginResult {
  name: string;
  age: number;
  friends?: Array<string>;
}
