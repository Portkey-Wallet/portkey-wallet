import { darkColors, defaultColors } from 'assets/theme';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

const styles = StyleSheet.create({
  scrollWrap: {
    marginTop: pTd(8),
  },
  itemRow: {
    height: pTd(48),
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: pTd(16),
    marginRight: pTd(16),
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: defaultColors.border6,
  },
  itemContent: {
    flex: 1,
    marginLeft: pTd(12),
    height: pTd(48),
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainTitle: {
    color: darkColors.textBase1,
  },
  itemIcon: {
    position: 'absolute',
    right: 0,
  },
  noResult: {
    lineHeight: pTd(22),
    textAlign: 'center',
    marginVertical: pTd(60),
    color: defaultColors.font7,
  },
});

export default styles;
