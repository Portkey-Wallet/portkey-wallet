import React from 'react';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import PageContainer from 'components/PageContainer';
import CommonQRCodeStyled from 'components/CommonQRCodeStyled';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import CommonAvatar from 'components/CommonAvatar';
import { TextXXL } from 'components/CommonText';

const ChatCamera: React.FC = () => {
  const { userId, walletName } = useWallet();

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: true }}
      hideTouchable={true}
      titleDom="Relation">
      <CommonAvatar title={walletName} avatarSize={pTd(40)} />
      <TextXXL>{walletName}</TextXXL>
      <CommonQRCodeStyled qrData={userId || ''} />
    </PageContainer>
  );
};

export default ChatCamera;

export const PageStyle = StyleSheet.create({
  safeAreaBox: {
    backgroundColor: defaultColors.bg19,
  },
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: defaultColors.bgColor1,
  },
  barCodeScanner: {
    width: '100%',
    flex: 1,
    zIndex: 100,
  },
  barCodeScannerAndroid: {
    width: screenWidth,
    height: screenHeight,
  },
  iconWrap: {
    marginTop: pTd(32),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  icon: {
    width: pTd(40),
  },
  svgWrap: {
    ...GStyles.paddingArg(16, 0, 16, 16),
  },
  leftBlock: {
    flex: 1,
  },
  buttonWrap: {
    width: screenWidth,
    height: pTd(112),
    zIndex: 100,
    paddingHorizontal: pTd(20),
  },
  reshutterWrap: {
    borderRadius: pTd(20),
    overflow: 'hidden',
  },
  shutter: {
    flex: 1,
  },
  sendButton: {
    height: pTd(40),
    minWidth: pTd(64),
    paddingHorizontal: pTd(16),
  },
  previewImage: {
    width: '100%',
  },
});
