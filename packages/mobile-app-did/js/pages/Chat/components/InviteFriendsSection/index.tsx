import React from 'react';
import { TextM, TextS } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { StyleSheet, View, Image } from 'react-native';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import fonts from 'assets/theme/fonts';

import InviteFriends from 'assets/image/pngs/invite-friends.png';
import navigationService from 'utils/navigationService';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';

export default function InviteFriendsSection() {
  const currentNetworkInfo = useCurrentNetworkInfo();
  return (
    <View style={BGStyles.bg6}>
      <Touchable
        style={styles.itemWrap}
        onPress={() => {
          navigationService.navigate('ProviderWebPage', {
            title: 'Portkey Referral Program',
            url: `${currentNetworkInfo.referralUrl}/referral`,
          });
        }}>
        <Image source={InviteFriends} style={styles.image} />
        <View style={styles.itemContent}>
          <TextM style={[fonts.mediumFont, FontStyles.font5]}>Invite Friends</TextM>
          <View style={styles.blank} />
          <TextS numberOfLines={1} style={FontStyles.font3}>
            Chat with your friends in Portkey
          </TextS>
        </View>
        <Svg icon="direction-right" size={pTd(20)} />
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrap: {
    width: '100%',
    height: pTd(80),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...GStyles.paddingArg(14, 16),
    backgroundColor: defaultColors.bg1,
    borderColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemImage: {
    marginRight: pTd(16),
  },
  itemContent: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  blank: {
    height: pTd(4),
  },
  itemRight: {
    marginRight: pTd(4),
    width: pTd(96),
    textAlign: 'right',
  },
  image: {
    width: pTd(60),
    height: pTd(60),
    marginRight: pTd(10),
  },
});
