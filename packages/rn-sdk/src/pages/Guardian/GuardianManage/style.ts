import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { windowHeight } from 'packages/utils/mobile/device';
import { getBottomSpace } from 'utils/screen';

const { bg1, font3, bg4, error } = defaultColors;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: bg4,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(24, 20, 18),
    minHeight: windowHeight - pTd(100),
  },
  contentWrap: {
    flex: 1,
  },
  titleLabel: {
    color: font3,
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
    color: error,
  },
  accountWrap: {
    marginBottom: pTd(24),
  },
  accountLabel: {
    color: font3,
    marginLeft: pTd(8),
    marginBottom: pTd(8),
    lineHeight: pTd(20),
  },
  oAuthBtn: {
    height: pTd(56),
    paddingHorizontal: pTd(16),
    justifyContent: 'center',
    backgroundColor: bg1,
    marginBottom: pTd(24),
    borderRadius: pTd(6),
  },
  typeIcon: {
    borderRadius: pTd(14),
    marginRight: pTd(12),
  },
  firstNameStyle: {
    marginBottom: pTd(2),
  },
  thirdPartAccount: {
    height: pTd(56),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg1,
    paddingHorizontal: pTd(16),
    justifyContent: 'center',
    marginBottom: pTd(24),
  },
  confirmBtn: {
    marginBottom: getBottomSpace(),
  },
});
