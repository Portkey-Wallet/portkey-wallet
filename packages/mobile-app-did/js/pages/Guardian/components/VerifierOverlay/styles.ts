import { defaultColors } from 'assets/theme';
import { StyleSheet } from 'react-native';
import { screenWidth, windowHeight } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';

const styles = StyleSheet.create({
  centerBox: {
    maxHeight: windowHeight * 0.7,
    maxWidth: 500,
    width: screenWidth - 48,
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(8),
    padding: pTd(24),
  },
  itemRow: {
    paddingVertical: 20,
    paddingHorizontal: pTd(24),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border4,
  },
  itemName: {
    marginLeft: 12,
  },
  itemIcon: {
    position: 'absolute',
    right: 26,
  },
});

export default styles;
