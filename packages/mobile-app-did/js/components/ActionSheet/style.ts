import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import { makeStyles } from '@rneui/themed';

export const styles = StyleSheet.create({
  sheetBox: {
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  itemText: {
    color: defaultColors.primaryColor,
    fontSize: 16,
  },
  itemBox: {
    width: '100%',
    paddingVertical: 15,
    overflow: 'hidden',
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: defaultColors.border1,
  },
  cancelText: {
    fontSize: 16,
  },
  cancelBox: {
    width: '100%',
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export const getStyles = makeStyles(theme => ({
  wrapStyle: {
    width: screenWidth,
    backgroundColor: theme.colors.bgBase1,
    overflow: 'hidden',
  },
  headerBackgroundBg: {
    width: '100%',
    height: pTd(160),
  },
  alertBox: {
    width: '100%',
    position: 'relative',
    paddingHorizontal: pTd(16),
  },
  alertHeader: {
    height: pTd(15),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertHeaderBlock: {
    width: pTd(32),
    height: pTd(3),
    borderRadius: pTd(1.5),
    backgroundColor: theme.colors.iconBase3,
  },
  alertTitle: {
    marginBottom: pTd(12),
  },
  alertMessage: {
    color: theme.colors.textBase1,
    marginBottom: pTd(12),
  },
  alertTitle2: {
    marginBottom: pTd(12),
  },
  buttonRowWrap: {
    marginTop: pTd(12),
  },
  closeWrap: {
    position: 'absolute',
    width: pTd(20),
    height: pTd(20),
    justifyContent: 'center',
    alignItems: 'center',
    right: pTd(18),
    top: pTd(18),
    zIndex: 1,
  },
  scrollViewStyle: {
    maxHeight: screenHeight * 0.45,
  },
  scrollViewContainerStyle: {
    minHeight: 0,
  },
}));
