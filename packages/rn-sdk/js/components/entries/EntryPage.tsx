import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { PortkeyEntries } from '../../config/entries';
import BaseContainer, { BaseContainerProps, BaseContainerState } from '../../model/container/BaseContainer';
import { LoginResult } from './LoginPage';
import { GuardianPageProps, GuardianResult } from './GuardianPage';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonLine: {
    width: '50%',
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
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
    fontSize: 8,
    color: 'black',
    lineHeight: 12,
    fontFamily: 'PingFangSC-Regular',
  },
  statusText: {
    fontSize: 8,
    color: 'black',
    lineHeight: 12,
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

  render() {
    const { isLogin, guardianNum } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.buttonLine}>
          <Text style={styles.statusText}>{`login status : ${
            isLogin ? 'has login' : 'not login yet'
          }, guardian count : ${guardianNum}`}</Text>
          <TouchableHighlight onPress={this.jumpToLoginPage}>
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>{'Login as Chara =)'}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onTransfer}>
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>{'Transfer'}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onEntryResult} disabled={this.isOkNow()}>
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>{'Go back with result'}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

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
      this.navigateForResult<GuardianResult>(
        PortkeyEntries.GUARDIAN,
        { params: { currGuardianNum: guardianNum, requiredGuardianNumber } as GuardianPageProps },
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
