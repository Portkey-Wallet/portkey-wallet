import { TouchableHighlight, View, Text, StyleSheet } from 'react-native';
import { PortkeyEntries } from '../../config/entries';
import BaseContainer, { BaseContainerProps, BaseContainerState } from '../../model/container/BaseContainer';
import React from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
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
  hello: {
    fontSize: 20,
    textAlign: 'center',
    color: '#6c928c',
    margin: 10,
    backgroundColor: 'yellow',
  },
});

export default class GuardianPage extends BaseContainer<GuardianPageProps, GuardianPageState, GuardianResult> {
  constructor(props) {
    super(props);
    this.state = {
      currGuardianNum: 0,
    };
  }

  getEntryName(): string {
    return PortkeyEntries.GUARDIAN;
  }

  componentDidMount(): void {
    const { currGuardianNum } = this.props;
    this.setState({ currGuardianNum });
  }

  render() {
    const { currGuardianNum } = this.state;
    const { requiredGuardianNumber } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.hello}>{`Guardian ${currGuardianNum} of ${requiredGuardianNumber}`}</Text>
        <TouchableHighlight onPress={this.addGuardian}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>{'Add Guardian'}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.subGuardian}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>{'Sub Guardian'}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.onBack}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>{'Go back'}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  addGuardian = () => {
    const { currGuardianNum } = this.state;
    this.setState({ currGuardianNum: currGuardianNum + 1 });
  };

  subGuardian = () => {
    const { currGuardianNum } = this.state;
    if (currGuardianNum > 0) {
      this.setState({ currGuardianNum: currGuardianNum - 1 });
    }
  };

  onBack = () => {
    const { currGuardianNum } = this.state;
    this.onFinish({ result: { guardianNum: currGuardianNum }, status: 'success' });
  };
}

export interface GuardianPageProps extends BaseContainerProps {
  requiredGuardianNumber: number;
  currGuardianNum: number;
}
export interface GuardianPageState extends BaseContainerState {
  currGuardianNum: number;
}
export interface GuardianResult {
  guardianNum: number;
}
