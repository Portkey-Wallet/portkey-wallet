import React, { useMemo } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import PageContainer from 'components/PageContainer';
import CommonQRCodeStyled from 'components/CommonQRCodeStyled';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextM, TextXXXL } from 'components/CommonText';
import { LinkPortkeyPath } from '@portkey-wallet/constants/constants-ca/network';
import { ScreenWidth } from '@rneui/base';
import Touchable from 'components/Touchable';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

const ChatQrCodePage: React.FC = () => {
  const isMainnet = useIsMainnet();
  const { avatar = '', userId = '', nickName = '' } = useCurrentUserInfo();

  const qrCodeData = useMemo(() => `${LinkPortkeyPath.addContact}${userId}`, [userId]);

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: false }}
      hideTouchable={true}
      titleDom="My QR Code"
      containerStyles={[PageStyle.containerStyles]}>
      <CommonAvatar
        hasBorder
        resizeMode="cover"
        title={nickName}
        avatarSize={pTd(80)}
        style={PageStyle.avatar}
        titleStyle={PageStyle.avatarTitleStyle}
        imageUrl={avatar}
      />
      <TextXXXL numberOfLines={1} style={GStyles.marginTop(pTd(8))}>
        {nickName || ''}
      </TextXXXL>
      <View style={PageStyle.qrCodeWrap}>
        <CommonQRCodeStyled qrData={qrCodeData || ''} width={pTd(236)} />
      </View>
      {isMainnet && <TextM style={GStyles.marginTop(pTd(20))}>Scan the QR code to chat with me in Portkey</TextM>}
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

export default ChatQrCodePage;

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
  },
  avatarTitleStyle: {
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
