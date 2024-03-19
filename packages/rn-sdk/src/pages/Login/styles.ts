import { screenHeight, screenWidth, windowHeight } from 'packages/utils/mobile/device';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

const styles = StyleSheet.create({
  backgroundContainer: {
    height: screenHeight,
  },
  containerStyles: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  logoIconStyle: {
    marginTop: 0,
  },
  titleStyle: {
    marginTop: pTd(12),
  },
  card: {
    flex: 1,
    width: screenWidth - 32,
    borderRadius: 16,
    marginTop: 32,
    paddingHorizontal: 20,
    paddingVertical: 24,
    minHeight: Math.min(screenHeight * 0.58, 494),
  },
  qrCodeCard: {
    paddingBottom: 0,
  },
  inputContainerStyle: {
    marginTop: 8,
    flex: 1,
  },
  viewContainer: {
    minHeight: windowHeight - pTd(160),
  },
  iconBox: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  iconStyle: {
    width: 60,
    height: 60,
  },
  signUpTip: {
    marginTop: pTd(40),
  },
  termsServiceTip: {
    position: 'absolute',
    bottom: 24,
  },
  qrCodeTitle: {
    marginTop: 18,
    marginBottom: 8,
  },
  qrCodeBox: {
    marginTop: 36,
  },
  loading: {
    top: 0,
    left: 0,
    position: 'absolute',
    width: screenWidth - 32 - 40 - 32,
    height: '100%',
    backgroundColor: '#ffffff',
    opacity: 0.96,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkRow: {
    marginTop: 24,
  },
  networkTip: {
    marginRight: pTd(8),
  },
  labelBox: {
    right: pTd(-50),
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: pTd(6),
    borderRadius: pTd(10),
    paddingVertical: 1,
  },
  scanLoading: {
    height: pTd(18),
    marginRight: pTd(8),
  },
});
export default styles;
