import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';

const { border1, bg4, bg1, bg6 } = defaultColors;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: bg4,
    ...GStyles.paddingArg(0, 20, 18),
  },

  contactInfo: {
    flexDirection: 'row',
    height: pTd(56),
    backgroundColor: bg1,
    alignItems: 'center',
    borderRadius: pTd(6),
    ...GStyles.paddingArg(0, 16),
  },
  titleWrap: {
    lineHeight: pTd(20),
    ...GStyles.paddingArg(24, 8, 8),
  },

  contactAvatar: {
    width: pTd(36),
    height: pTd(36),
    borderRadius: pTd(18),
    backgroundColor: bg6,
    marginRight: pTd(8),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: border1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressWrap: {
    height: pTd(96),
    backgroundColor: bg1,
    borderRadius: pTd(6),
    marginBottom: pTd(8),
    padding: pTd(16),
    flexDirection: 'row',
  },
  addressInfo: {
    flex: 1,
    marginRight: pTd(20),
    justifyContent: 'space-between',
  },
  addressLabel: {
    lineHeight: pTd(20),
  },
});
