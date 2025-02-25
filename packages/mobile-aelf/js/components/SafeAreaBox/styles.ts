import { bottomBarHeight } from '@portkey-wallet/utils/mobile/device';
import { darkColors } from 'assets/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: darkColors.bgBase1,
    width: '100%',
    height: '100%',
  },
  pageSafeBottom: {
    paddingBottom: bottomBarHeight || 25,
  },
});

export default styles;
