import React from 'react';
import { View, StyleSheet } from 'react-native';
import Spinner from 'react-native-spinkit';
import { RefreshHeader } from 'react-native-spring-scrollview/RefreshHeader';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
export default class UpPullLoading extends RefreshHeader {
  static height = 50;

  static style = 'stickyContent';
  _renderIcon = () => {
    return <Spinner size={36} type="WordPress" color={defaultColors.primaryColor} style={GStyles.alignCenter} />;
  };
  render() {
    return <View style={styles.container}>{this._renderIcon()}</View>;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  rContainer: {
    marginLeft: 10,
  },
  text: {
    marginVertical: 5,
    fontSize: 15,
    color: defaultColors.primaryColor,
  },
});
