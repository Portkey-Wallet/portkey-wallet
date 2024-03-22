import { StyleSheet } from 'react-native';
import { pTd } from '../../utils/unit';
import { Theme } from '../../theme/type';

export const commonStyles = StyleSheet.create({
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
  loadingStyle: {
    width: pTd(20),
  },
});
export const getSearchStyles = (theme: Theme) =>
  StyleSheet.create({
    containerStyle: {
      height: pTd(36),
      paddingLeft: 0,
      paddingRight: 0,
    },
    inputContainerStyle: {
      borderBottomWidth: 0,
      backgroundColor: theme.bg4,
      height: pTd(36),
      borderRadius: pTd(6),
    },
    inputStyle: {
      fontSize: pTd(14),
      // ...GStyles.marginArg(14, 16),
      // height: pTd(50),
      marginLeft: pTd(4),
      marginRight: pTd(14),
    },
    labelStyle: {},
    rightIconContainerStyle: {
      marginRight: pTd(16),
    },
    leftIconContainerStyle: {
      marginLeft: pTd(12),
    },
  });

export const getGeneralStyles = (theme: Theme) =>
  StyleSheet.create({
    containerStyle: {
      ...theme.paddingArg(0),
      ...theme.marginArg(0),
    },
    inputContainerStyle: {
      borderColor: theme.border1,
      borderWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      height: pTd(56),
      borderRadius: pTd(6),
    },
    inputStyle: {
      fontSize: pTd(14),
      color: theme.font5,
      ...theme.marginArg(18, 16),
      minHeight: pTd(60),
      height: pTd(60),
    },
    labelStyle: {
      color: theme.font3,
      fontSize: pTd(14),
      lineHeight: pTd(20),
      marginBottom: pTd(8),
      fontWeight: '400',
      paddingLeft: pTd(8),
    },
    rightIconContainerStyle: {
      marginRight: pTd(10),
    },
    errorStyle: {
      marginLeft: 0,
      paddingLeft: pTd(8),
      fontSize: pTd(12),
      lineHeight: pTd(16),
    },
    disabledInputStyle: {
      color: theme.font5,
      opacity: 1,
    },
  });

export const getBgWhiteStyles = (theme: Theme) =>
  StyleSheet.create({
    inputContainerStyle: {
      borderColor: theme.bg1,
      borderWidth: 0,
      borderRadius: pTd(6),
      backgroundColor: theme.bg1,
    },
  });
