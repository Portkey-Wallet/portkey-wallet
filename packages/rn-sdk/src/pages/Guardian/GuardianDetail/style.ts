import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { getBottomSpace } from 'utils/screen';

const { font3, bg1, bg4, border6 } = defaultColors;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: bg4,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(24, 20, 18),
  },
  contentWrap: {
    flex: 1,
  },
  guardianInfoWrap: {
    backgroundColor: bg1,
    marginBottom: pTd(24),
    borderRadius: pTd(6),
  },
  dividerStyle: {
    ...GStyles.marginArg(4, 16),
  },
  guardianTypeWrap: {
    height: pTd(56),
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifierInfoWrap: {
    borderTopColor: border6,
    height: pTd(56),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pTd(16),
  },
  loginSwitchWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: pTd(16),
    backgroundColor: bg1,
    marginBottom: pTd(24),
    height: pTd(56),
    alignItems: 'center',
    borderRadius: pTd(6),
    display: 'none',
  },
  tips: {
    color: font3,
    lineHeight: pTd(20),
  },
  loginTypeIcon: {
    borderRadius: pTd(14),
    marginRight: pTd(12),
  },
  verifierImageStyle: {
    marginRight: pTd(12),
  },
  bottomButton: {
    marginBottom: getBottomSpace(),
  },
});
