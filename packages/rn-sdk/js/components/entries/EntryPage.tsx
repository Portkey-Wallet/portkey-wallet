import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { PortkeyEntries } from '../../config/entries';
import BaseContainer, { BaseContainerProps, BaseContainerState } from '../../model/container/BaseContainer';
import { LoginResult } from './LoginPage';
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
    return (
      <View style={styles.container}>
        <View style={styles.buttonLine}>
          <TouchableHighlight>
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>{'Login as Chara =)'}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight>
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>{'Transfer'}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  jumpToLoginPage = () => {
    this.navigateForResult<LoginResult>(PortkeyEntries.LOGIN, {}, res => {
      if (res.status === 'success') {
        this.setState({ isLogin: true });
      } else {
        this.setState({ isLogin: false });
      }
    });
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
