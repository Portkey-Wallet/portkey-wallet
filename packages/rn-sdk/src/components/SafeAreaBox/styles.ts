import { bottomBarHeight } from '@portkey-wallet/utils/mobile/device';
import { defaultColors } from 'assets/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg1,
    width: '100%',
    height: '100%',
  },
  pageSafeBottom: {
    paddingBottom: bottomBarHeight || 25,
  },
});

export default styles;
