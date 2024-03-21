import { StyleSheet } from 'react-native';

import { defaultColors } from 'assets/theme';
import gStyles from 'assets/theme/GStyles';

const { bg4 } = defaultColors;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: bg4,
    justifyContent: 'space-between',
    ...gStyles.paddingArg(32, 20, 18),
  },
});
