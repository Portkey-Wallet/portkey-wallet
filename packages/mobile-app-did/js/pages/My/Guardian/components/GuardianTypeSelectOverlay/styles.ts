import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

const styles = StyleSheet.create({
  itemRow: {
    flex: 1,
    height: pTd(48),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pTd(16),
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIconWrap: {
    borderRadius: pTd(18),
    marginRight: pTd(12),
  },
  itemIcon: {
    right: 0,
    position: 'absolute',
  },
  typeOverlayTitleLabel: {
    marginTop: pTd(16),
    marginBottom: pTd(8),
    textAlign: 'center',
  },
});

export default styles;
