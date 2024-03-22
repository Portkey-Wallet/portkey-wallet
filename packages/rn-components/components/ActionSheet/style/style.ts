import { StyleSheet } from 'react-native';
import { pTd } from '../../../utils/unit';
import { screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import { ThemeStyleSheet } from '../../../theme';
const theme = ThemeStyleSheet.create();

export const styles = StyleSheet.create({
  wrapStyle: {
    padding: 0,
  },
  sheetBox: {
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: 'white',
    width: screenWidth,
  },
  itemText: {
    color: theme.primaryColor,
    fontSize: 16,
  },
  headerBackgroundBg: {
    width: '100%',
    height: pTd(160),
  },
  itemBox: {
    width: '100%',
    paddingVertical: 15,
    overflow: 'hidden',
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: theme.border1,
  },
  cancelText: {
    fontSize: 16,
  },
  contentSection: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: pTd(24),
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
  alertBox: {
    overflow: 'hidden',
    borderRadius: 8,
    alignItems: 'center',
    width: screenWidth - 48,
    backgroundColor: 'white',
    padding: pTd(24),
  },
  alertTitle: {
    textAlign: 'center',
    marginBottom: pTd(16),
  },
  alertMessage: {
    color: theme.font3,
    marginBottom: pTd(12),
    textAlign: 'center',
  },
  alertTitle2: {
    color: theme.font5,
    marginBottom: pTd(16),
    textAlign: 'center',
  },
  closeWrap: {
    width: pTd(20),
    height: pTd(20),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: pTd(12),
    top: pTd(12),
  },
  scrollViewStyle: {
    maxHeight: screenHeight * 0.45,
  },
  scrollViewContainerStyle: {
    minHeight: 0,
  },
  buttonBox: {
    marginTop: pTd(20),
  },
});
