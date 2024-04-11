import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import { StyleSheet } from 'react-native';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';

const styles = StyleSheet.create({
  itemRow: {
    height: pTd(76),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
    marginHorizontal: pTd(20),
  },
  verifierImageStyle: {
    marginRight: pTd(12),
  },
  itemContent: {
    flex: 1,
    height: pTd(76),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    position: 'absolute',
    right: 0,
  },
  typeOverlayTitleLabel: {
    marginTop: pTd(16),
    marginBottom: pTd(8),
    textAlign: 'center',
  },
  warnWrap: {
    backgroundColor: defaultColors.bg6,
    borderRadius: pTd(6),
    padding: pTd(12),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: pTd(16),
    marginHorizontal: pTd(20),
  },
  warnLabelWrap: {
    color: defaultColors.font3,
    marginLeft: pTd(8),
    flex: 1,
  },
  disableWrap: {
    opacity: 0.3,
  },
});

export default styles;
