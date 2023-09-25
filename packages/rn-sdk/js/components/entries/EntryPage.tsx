import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight, NativeModules } from 'react-native';
import { PortkeyEntries } from '../../config/entries';
import BaseContainer, { BaseContainerProps, BaseContainerState } from '../../model/container/BaseContainer';
import { LoginResult } from './LoginPage';
import { GuardianPageProps, GuardianResult } from './GuardianPage';
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonLine: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  touchable: {
    paddingVertical: 8,
  },
  buttonWrapper: {
    width: '100%',
    height: 50,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderColor: 'grey',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    lineHeight: 32,
    fontFamily: 'PingFangSC-Regular',
    paddingHorizontal: 16,
  },
  statusText: {
    fontSize: 20,
    color: 'black',
    lineHeight: 32,
    fontFamily: 'PingFangSC-Regular',
    textAlign: 'center',
  },
});

const requiredGuardianNumber = 3;

export default class EntryPage extends BaseContainer<EntryPageProps, EntryPageState, EntryResult> {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      guardianNum: 0,
    };
  }

  getEntryName(): string {
    return PortkeyEntries.ENTRY;
  }

  myWebComponent = () => {
    return <WebView source={{ uri: 'https://reactnative.dev/' }} style={{ flex: 1 }} />;
  }

  render() {
    const { isLogin, guardianNum } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.buttonLine}>
          <Text style={styles.statusText}>{`login status : ${
            isLogin ? 'has login' : 'not login yet'
          }\n guardian count : ${guardianNum}`}</Text>
          {this.functionalBtn(this.jumpToLoginPage, 'Login as Chara =)')}
          {this.functionalBtn(this.onTransfer, 'Transfer')}
          {this.functionalBtn(this.onEntryResult, 'Go back with result')}
        </View>
      </View>
    );
  }

  functionalBtn = (callback: () => void, text: string, disabled: boolean = false) => {
    return (
      <TouchableHighlight
        style={styles.touchable}
        onPress={callback}
        disabled={disabled}
        underlayColor={'gray'}
        activeOpacity={0.8}>
        <View style={styles.buttonWrapper}>
          <Text style={styles.buttonText}>{text}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  isOkNow = () => {
    const { isLogin, guardianNum } = this.state;
    return isLogin && guardianNum >= requiredGuardianNumber;
  };

  jumpToLoginPage = () => {
    this.navigateForResult<LoginResult>(PortkeyEntries.LOGIN, {}, res => {
      if (res.status === 'success') {
        console.warn(`Login success : U R ${res.result.name}`);
        this.setState({ isLogin: true });
      } else {
        console.warn(`Login failed!`);
        this.setState({ isLogin: false });
      }
    });
  };

  onTransfer = () => {
    const { guardianNum } = this.state;
    if (guardianNum < requiredGuardianNumber) {
      this.navigateForResult<GuardianResult, GuardianPageProps>(
        PortkeyEntries.GUARDIAN,
        {
          params: {
            currGuardianNum: guardianNum,
            requiredGuardianNumber,
          },
        },
        res => {
          if (res.status === 'success') {
            console.warn(`Guardian success : guardian num ${res.result.guardianNum}`);
            this.setState({ guardianNum: res.result.guardianNum });
          } else {
            console.warn(`Guardian failed! Reset to 0`);
            this.setState({ guardianNum: 0 });
          }
        },
      );
    } else {
      console.warn(`you have enough guardian : ${guardianNum}/${requiredGuardianNumber}, transfer success!`);
    }
  };

  onEntryResult = () => {
    if (this.isOkNow()) {
      this.onFinish({ result: { isEverythingOk: true }, status: 'success' });
    } else {
      console.warn(`not finished...`);
    }
  };
}

export interface EntryPageProps extends BaseContainerProps {}

export interface EntryPageState extends BaseContainerState {
  isLogin: boolean;
  guardianNum: number;
}

export interface EntryResult {
  isEverythingOk: boolean;
}
