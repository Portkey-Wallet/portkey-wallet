import React, { useMemo } from 'react';
import { Share, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { isIOS, screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import PageContainer from 'components/PageContainer';
import CommonQRCodeStyled from 'components/CommonQRCodeStyled';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import CommonAvatar from 'components/CommonAvatar';
import { TextXXL } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import { OfficialWebsitePortkeyIdPath } from '@portkey-wallet/constants/constants-ca/network';

const ChatCamera: React.FC = () => {
  const { userId, walletName } = useWallet();

  const qrCodeData = useMemo(() => `${OfficialWebsitePortkeyIdPath}/${userId}`, [userId]);

  console.log('OfficialWebsitePortkeyIdPath', OfficialWebsitePortkeyIdPath);

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: true }}
      hideTouchable={true}
      titleDom="Relation"
      containerStyles={{}}>
      <CommonAvatar title={walletName} avatarSize={pTd(40)} />
      <TextXXL>{walletName}</TextXXL>
      <CommonQRCodeStyled qrData={userId || ''} />
      <TextXXL>scan my qr code</TextXXL>
      <CommonButton
        title="share my qr code"
        onPress={async () => {
          await Share.share({
            message: qrCodeData,
            url: qrCodeData,
            title: qrCodeData,
          }).catch(shareError => {
            console.log(shareError);
          });
        }}
      />
    </PageContainer>
  );
};

export default ChatCamera;

export const PageStyle = StyleSheet.create({
  containerStyles: {
    textAlign: 'center',
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
