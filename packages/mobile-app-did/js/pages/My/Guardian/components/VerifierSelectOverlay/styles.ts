import { defaultColors } from 'assets/theme';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

const styles = StyleSheet.create({
  itemRow: {
    height: pTd(76),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
    paddingLeft: pTd(24),
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
    right: 26,
  },
  typeOverlayTitleLabel: {
    marginTop: pTd(16),
    marginBottom: pTd(8),
    textAlign: 'center',
  },
});

export default styles;
