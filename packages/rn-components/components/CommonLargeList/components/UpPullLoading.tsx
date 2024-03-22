import React from 'react';
import { View, StyleSheet } from 'react-native';
import Spinner from 'react-native-spinkit';
import { RefreshHeader } from 'react-native-spring-scrollview/RefreshHeader';
import { Theme } from '../../../theme/type';
import { ThemeContext } from '../../../theme/context';
import { getRealTheme } from '../../../theme';
export default class UpPullLoading extends RefreshHeader {
  static height = 50;
  static contextType = ThemeContext;
  static style = 'stickyContent';
  _renderIcon = (theme: Theme) => {
    return <Spinner size={36} type="WordPress" color={theme.primaryColor} style={theme.alignCenter} />;
  };
  render() {
    return (
      <ThemeContext.Consumer>
        {theme => {
          const realTheme = getRealTheme(theme);
          return <View style={getStyles(realTheme as Theme).container}>{this._renderIcon(realTheme as Theme)}</View>;
        }}
      </ThemeContext.Consumer>
    );
  }
}
const getStyles = (theme: Theme) =>
  StyleSheet.create({
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
      color: theme.primaryColor,
    },
  });
