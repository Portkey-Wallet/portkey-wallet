import { StyleSheet } from 'react-native';

import { defaultColors } from 'assets/theme';
import gStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';

const { bg19 } = defaultColors;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: bg19,
  },
  wrapStyle: {
    flexGrow: 1,
  },
  item: {
    height: pTd(48),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: pTd(8),
  },
  label: {
    fontSize: pTd(14),
    color: defaultColors.font5,
  },
});
