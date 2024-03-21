import React, { useMemo } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import PageContainer from 'components/PageContainer';
import CommonQRCodeStyled from 'components/CommonQRCodeStyled';
import { TextL, TextM, TextXXXL } from 'components/CommonText';
import { LinkPortkeyPath } from '@portkey-wallet/constants/constants-ca/network';
import { ScreenWidth } from '@rneui/base';
import Touchable from 'components/Touchable';
import { RouteProp, useRoute } from '@react-navigation/native';
import GroupAvatarShow from '../components/GroupAvatarShow';

export type ChatGroupQrCodePageRouteTypes = {
  groupId: string;
  groupName: string;
  groupIcon: string;
};

const ChatGroupQrCodePage: React.FC = () => {
  const {
    params: { groupId, groupName, groupIcon },
  } = useRoute<
    RouteProp<{
      params: ChatGroupQrCodePageRouteTypes;
    }>
  >();

  const qrCodeData = useMemo(() => `${LinkPortkeyPath.addGroup}${groupId || ''}`, [groupId]);

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: false }}
      hideTouchable={true}
      titleDom="Group QR Code"
      containerStyles={[PageStyle.containerStyles]}>
      <GroupAvatarShow
        wrapStyle={PageStyle.avatarWrap}
        logoSize={pTd(20)}
        avatarSize={pTd(80)}
        imageUrl={groupIcon}
        svgName={groupIcon ? undefined : 'chat-group-avatar'}
      />

      <TextXXXL numberOfLines={1} style={GStyles.marginTop(pTd(8))}>
        {groupName || ''}
      </TextXXXL>
      <View style={PageStyle.qrCodeWrap}>
        <CommonQRCodeStyled qrData={qrCodeData || ''} width={pTd(236)} />
      </View>
      <TextM style={GStyles.marginTop(pTd(20))}>Scan this QR code to join the group</TextM>
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

export default ChatGroupQrCodePage;

export const PageStyle = StyleSheet.create({
  containerStyles: {
    width: ScreenWidth,
    paddingVertical: 0,
    paddingHorizontal: pTd(20),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatarWrap: {
    marginTop: pTd(24),
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
