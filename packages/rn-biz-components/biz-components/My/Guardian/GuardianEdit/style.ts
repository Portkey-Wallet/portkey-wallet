import { StyleSheet } from 'react-native';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import { windowHeight } from '@portkey-wallet/utils/mobile/device';

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(24, 20, 18),
    minHeight: windowHeight - pTd(100),
  },
  contentWrap: {
    flex: 1,
  },
  titleLabel: {
    color: defaultColors.font3,
    lineHeight: pTd(20),
    ...GStyles.marginArg(0, 0, 8, 8),
  },
  typeWrap: {
    marginBottom: pTd(24),
  },
  titleTextStyle: {
    fontSize: pTd(14),
  },
  verifierImageStyle: {
    marginRight: pTd(12),
  },
  verifierWrap: {
    marginBottom: pTd(4),
  },
  removeBtnWrap: {
    marginTop: pTd(8),
  },
  errorTips: {
    color: defaultColors.error,
    marginLeft: pTd(8),
  },
  accountWrap: {
    marginBottom: pTd(24),
  },
  accountLabel: {
    color: defaultColors.font3,
    marginLeft: pTd(8),
    marginBottom: pTd(8),
    lineHeight: pTd(20),
  },
  typeIcon: {
    borderRadius: pTd(14),
    marginRight: pTd(12),
  },
  itemIconWrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
    backgroundColor: defaultColors.bg6,
    width: pTd(32),
    height: pTd(32),
    borderRadius: pTd(16),
    marginRight: pTd(10),
  },
});
