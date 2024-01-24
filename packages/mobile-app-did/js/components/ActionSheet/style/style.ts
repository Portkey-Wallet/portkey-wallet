import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';

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
  alertBox: {
    overflow: 'hidden',
    borderRadius: 8,
    alignItems: 'center',
    width: screenWidth - 48,
    backgroundColor: 'white',
    padding: pTd(24),
  },
  alertBoxWithClose: {
    paddingTop: pTd(32),
    paddingBottom: pTd(16),
  },
  alertTitle: {
    textAlign: 'center',
    marginBottom: pTd(16),
  },
  alertMessage: {
    color: defaultColors.font3,
    marginBottom: pTd(12),
    textAlign: 'center',
  },
  alertTitle2: {
    color: defaultColors.font5,
    marginBottom: pTd(12),
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
  scrollViewContainerStyle: {
    minHeight: 0,
  },
  scrollViewStyle: {
    maxHeight: screenHeight * 0.45,
  },
  buttonBox: {
    marginTop: pTd(20),
  },
});
