import { StyleSheet } from 'react-native';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';

export const styles = StyleSheet.create({
  sectionListWrap: {
    flex: 1,
    overflow: 'hidden',
  },
  sectionListWrapFull: {
    paddingRight: 0,
  },
  sectionIndex: {
    height: pTd(28),
    paddingLeft: pTd(20),
    lineHeight: pTd(28),
    fontSize: pTd(20),
  },
  indexBarWrap: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
