import { screenHeight, screenWidth, windowHeight } from '@portkey-wallet/utils/mobile/device';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';

const styles = makeStyles(theme => ({
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
    width: '100%',
    marginTop: pTd(16),
    marginBottom: pTd(40),
    paddingVertical: pTd(24),
    minHeight: Math.min(screenHeight * 0.58, 494),
  },
  cardContent: {
    height: '100%',
  },
  emailTitle: {
    marginBottom: pTd(48),
  },
  qrCodeCard: {
    paddingBottom: 0,
  },
  emailInputContainerStyle: {
    width: '100%',
  },
  emailInputInputContainerStyle: {
    borderWidth: pTd(1),
    borderRadius: pTd(8),
    borderColor: theme.colors.borderBase1,
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
    width: pTd(60),
    height: pTd(60),
  },
  signUpTip: {
    // height: pTd(48),
    // position: 'absolute',
    // bottom: pTd(84),
  },
  termsServiceTip: {
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
  },
  textWrap: {
    width: '100%',
    textAlign: 'center',
    lineHeight: pTd(20),
  },
  link: {
    color: theme.colors.textBrand1,
    lineHeight: pTd(20),
  },
  qrCodeTitle: {
    marginTop: pTd(18),
    marginBottom: pTd(8),
  },
  qrCodeBox: {
    marginTop: pTd(36),
  },
  loading: {
    top: 0,
    left: 0,
    position: 'absolute',
    width: screenWidth - pTd(32) - pTd(40) - pTd(32),
    height: '100%',
    backgroundColor: '#ffffff',
    opacity: 0.96,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkRow: {
    marginTop: pTd(24),
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
}));
export default styles;
