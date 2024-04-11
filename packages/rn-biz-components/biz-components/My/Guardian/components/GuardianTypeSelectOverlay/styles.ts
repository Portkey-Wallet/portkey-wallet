import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import { StyleSheet } from 'react-native';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';

const styles = StyleSheet.create({
  itemRow: {
    flex: 1,
    height: pTd(72),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
    height: pTd(72),
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: pTd(20),
  },
  itemIconWrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
    backgroundColor: defaultColors.bg6,
    width: pTd(32),
    height: pTd(32),
    borderRadius: pTd(16),
    marginRight: pTd(16),
  },
  itemIcon: {
    right: pTd(2),
    position: 'absolute',
  },
  typeOverlayTitleLabel: {
    marginTop: pTd(16),
    marginBottom: pTd(8),
    textAlign: 'center',
  },
});

export default styles;
