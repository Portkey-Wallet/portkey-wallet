import React, { useMemo } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import PageContainer from 'components/PageContainer';
import CommonQRCodeStyled from 'components/CommonQRCodeStyled';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextM, TextXXXL } from 'components/CommonText';
import { AddContactLinkPath } from '@portkey-wallet/constants/constants-ca/network';
import { ScreenWidth } from '@rneui/base';
import Touchable from 'components/Touchable';

const ChatCamera: React.FC = () => {
  const { userId, walletName } = useWallet();
  const qrCodeData = useMemo(() => `${AddContactLinkPath}${userId}`, [userId]);

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: false }}
      hideTouchable={true}
      titleDom="My QR Code"
      containerStyles={[PageStyle.containerStyles]}>
      <CommonAvatar hasBorder title={walletName} avatarSize={pTd(80)} style={PageStyle.avatar} />
      <TextXXXL numberOfLines={1} style={GStyles.marginTop(pTd(8))}>
        {walletName}
      </TextXXXL>
      <View style={PageStyle.qrCodeWrap}>
        <CommonQRCodeStyled qrData={qrCodeData || ''} pieceSize={6} style={PageStyle.qrCode} />
      </View>
      <TextM style={GStyles.marginTop(pTd(20))}>Scan the QR code to chat with me in Portkey</TextM>
      <Touchable
        style={PageStyle.buttonWrap}
        onPress={async () => {
          await Share.share({
            message: qrCodeData,
          }).catch(shareError => {
            console.log(shareError);
          });
        }}>
        <TextL style={PageStyle.buttonTitle}>Share QR Code</TextL>
      </Touchable>
    </PageContainer>
  );
};

export default ChatCamera;

export const PageStyle = StyleSheet.create({
  containerStyles: {
    width: ScreenWidth,
    paddingVertical: 0,
    paddingHorizontal: pTd(20),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    marginTop: pTd(24),
    fontSize: pTd(40),
  },
  qrCodeWrap: {
    padding: pTd(16),
    marginTop: pTd(24),
    borderRadius: pTd(12),
    shadowOffset: { width: 2, height: 10 },
    backgroundColor: defaultColors.bg1,
    shadowColor: defaultColors.shadow1,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 2,
  },
  qrCode: {
    width: pTd(268),
    height: pTd(268),
  },
  buttonWrap: {
    marginTop: pTd(78),
    padding: pTd(10),
    width: pTd(300),
  },
  buttonTitle: {
    lineHeight: pTd(48),
    color: defaultColors.font4,
    textAlign: 'center',
  },
});
