import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { ScreenHeight } from '@rneui/base';
import GStyles from 'assets/theme/GStyles';

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg4,
    height: ScreenHeight - pTd(130),
    paddingLeft: 0,
    paddingRight: 0,
  },
  iconStyle: {
    paddingRight: pTd(24),
    paddingLeft: pTd(24),
  },
  group: {
    backgroundColor: defaultColors.bg1,
    marginTop: pTd(24),
    marginHorizontal: pTd(16),
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    borderRadius: pTd(6),
  },
  buttonWrapStyle: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'flex-end',
    width: pTd(375),
    ...GStyles.paddingArg(12, 20),
  },
  errorMessage: {
    lineHeight: pTd(16),
    color: defaultColors.error,
    marginTop: pTd(4),
    marginLeft: pTd(26),
    paddingLeft: pTd(8),
  },
  warnMessage: {
    color: defaultColors.font6,
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
    backgroundColor: defaultColors.bg18,
  },
  alertMessage: {
    color: defaultColors.font3,
    marginBottom: pTd(12),
    textAlign: 'center',
  },
});

export const thirdGroupStyle = StyleSheet.create({
  wrap: {
    height: pTd(56),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  borderTop: {
    borderTopColor: defaultColors.border6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  title: {
    flex: 1,
    color: defaultColors.font3,
  },
  tokenNum: {
    textAlign: 'right',
    color: defaultColors.font5,
  },
  usdtNum: {
    marginLeft: pTd(6),
    marginTop: pTd(4),
    color: defaultColors.font3,
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
});

export const otherChainWarningStyle = StyleSheet.create({
  wrap: {
    backgroundColor: defaultColors.bg35,
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(8),
    marginHorizontal: pTd(16),
    marginTop: pTd(12),
    borderRadius: pTd(6),
    borderWidth: pTd(0.5),
    borderColor: defaultColors.border9,
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
    color: defaultColors.font18,
  },
  linkText: {
    fontSize: pTd(14),
    lineHeight: pTd(22),
    color: defaultColors.primaryColor,
    textDecorationLine: 'underline',
    textDecorationColor: defaultColors.primaryColor,
  },
  icon: {
    marginTop: pTd(4),
  },
});
