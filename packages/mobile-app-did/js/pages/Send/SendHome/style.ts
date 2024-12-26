import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { ScreenHeight } from '@rneui/base';
import { makeStyles } from '@rneui/themed';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';

export const getStyles = makeStyles(theme => ({
  container: {
    justifyContent: 'space-between',
    flex: 1,
    height: ScreenHeight - pTd(130),
    position: 'relative',
  },
  pageWrap: {
    backgroundColor: theme.colors.bg4,
    height: ScreenHeight - pTd(130),
    paddingLeft: 0,
    paddingRight: 0,
  },
  mainWrap: {
    flex: 1,
  },
  iconStyle: {
    paddingHorizontal: pTd(16),
  },
  group: {
    backgroundColor: theme.colors.bg1,
    marginTop: pTd(16),
    marginHorizontal: pTd(16),
    borderRadius: pTd(6),
  },
  bottomWrapStyle: {
    justifyContent: 'flex-end',
    width: screenWidth,
  },
  errorMessage: {
    lineHeight: pTd(16),
    color: theme.colors.error,
    marginTop: pTd(4),
    marginLeft: pTd(26),
    paddingLeft: pTd(8),
  },
  warnMessage: {
    color: theme.colors.font6,
  },
  nftErrorMessage: {
    marginLeft: 0,
    paddingLeft: 0,
    textAlign: 'center',
  },
  space: {
    height: pTd(16),
  },
  warningWrap: {
    marginTop: pTd(12),
    marginBottom: -pTd(8),
    padding: pTd(12),
    marginHorizontal: pTd(20),
    borderRadius: pTd(6),
    backgroundColor: theme.colors.bg18,
  },
  alertMessage: {
    color: theme.colors.font3,
    marginBottom: pTd(12),
    textAlign: 'center',
  },
}));

export const getThirdGroupStyle = makeStyles(theme => ({
  wrap: {
    height: pTd(56),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  borderTop: {
    borderTopColor: theme.colors.border6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  title: {
    flex: 1,
    color: theme.colors.font3,
  },
  tokenNum: {
    textAlign: 'right',
    color: theme.colors.font5,
  },
  usdtNum: {
    marginLeft: pTd(6),
    marginTop: pTd(4),
    color: theme.colors.font3,
    textAlign: 'right',
  },
  notELFWrap: {
    height: pTd(84),
    alignItems: 'flex-start',
    paddingTop: pTd(18),
    paddingBottom: pTd(18),
  },
  totalWithUSD: {
    marginTop: pTd(12),
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
}));

export const getOtherChainWarningStyle = makeStyles(theme => ({
  wrap: {
    backgroundColor: theme.colors.bg35,
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(8),
    marginHorizontal: pTd(16),
    marginTop: pTd(12),
    borderRadius: pTd(6),
    borderWidth: pTd(0.5),
    borderColor: theme.colors.border9,
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  text: {
    flex: 20,
    paddingLeft: pTd(4),
  },
  commonText: {
    fontSize: pTd(14),
    lineHeight: pTd(22),
    color: theme.colors.font18,
  },
  linkText: {
    fontSize: pTd(14),
    lineHeight: pTd(22),
    color: theme.colors.primaryColor,
    textDecorationLine: 'underline',
    textDecorationColor: theme.colors.primaryColor,
  },
  icon: {
    marginTop: pTd(4),
  },
}));
