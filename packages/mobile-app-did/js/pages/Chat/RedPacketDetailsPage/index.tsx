import React, { useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM, TextS, TextXL } from 'components/CommonText';
import navigationService from 'utils/navigationService';
import Packet_Detail_Header_Bg from '../img/Packet_Detail_Header_Bg.png';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import PageContainer from 'components/PageContainer';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import CommonAvatar from 'components/CommonAvatar';
import { FontStyles } from 'assets/theme/styles';
import Divider from 'components/Divider';
import RedPacketReceiverItem from '../components/RedPacketReceiverItem';
import RedPacketAmountShow from '../components/RedPacketAmountShow';
import { formatRedPacketNoneLeftTime } from '../utils/format';

export const RedPacketDetails = () => {
  const [, refreshLayout] = useState(0);
  return (
    <PageContainer
      hideHeader
      hideTouchable
      containerStyles={styles.container}
      safeAreaColor={['red', 'white']}
      scrollViewProps={{ disabled: true }}>
      <ImageBackground source={Packet_Detail_Header_Bg} style={styles.headerWrap}>
        <Touchable onPress={navigationService.goBack} style={styles.backIconWrap}>
          <Svg icon="left-arrow" size={pTd(20)} color={defaultColors.font2} />
        </Touchable>
      </ImageBackground>
      <View style={GStyles.flex1} onLayout={() => refreshLayout(i => ++i)}>
        <FlatList
          contentContainerStyle={styles.flatListContentContainerStyle}
          data={new Array(4)}
          ListHeaderComponent={() => (
            <>
              <View style={[GStyles.center, styles.topWrap]}>
                <CommonAvatar style={styles.sendAvatar} avatarSize={pTd(48)} title="hi" />
                <TextXL numberOfLines={1} style={[FontStyles.font5, styles.sendBy]}>
                  Red Packet Sent by ZOE ZOE ZOE ZOE ZOE ZOE ZOE ZOE ZOE ZOE ZOE ZOE ZOE ZOE ZOE ZOE ZOE ZOE ZOE ZOE .
                </TextXL>
                <TextM style={[FontStyles.font7, styles.memo]}> Best Wishes!</TextM>
                {/* TODO: change fontSize */}
                <RedPacketAmountShow
                  componentType="packetDetailPage"
                  decimals={8}
                  amount="1000000000001010001010"
                  symbol="ELF"
                />
                <TextS style={[FontStyles.font15, styles.tips]}>Red Packet transferred to Wallet</TextS>
              </View>
              <Divider width={pTd(8)} style={styles.divider} />
              <TextM style={[FontStyles.font7, styles.redPacketStyleIntro]}>
                {formatRedPacketNoneLeftTime(Date.now(), Date.now() + 800)}
              </TextM>
              <TextM style={[FontStyles.font7, styles.redPacketStyleIntro]}>
                {`Red packet expired. Opened 3/10 with 30/20000.002 ELF`}
              </TextM>
              <Divider style={styles.innerDivider} />
            </>
          )}
          renderItem={() => <RedPacketReceiverItem key={Math.random()} />}
          ListFooterComponentStyle={styles.listFooterComponentStyle}
          ListFooterComponent={() => (
            <TextM style={styles.bottomTips}>Unopened Red Packets will be refunded when they expired</TextM>
          )}
        />
      </View>
    </PageContainer>
  );
};

export default RedPacketDetails;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg1,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  innerWrap: {
    paddingBottom: pTd(0),
    flex: 1,
  },
  headerWrap: {
    width: screenWidth,
    height: pTd(76),
  },
  backIconWrap: {
    paddingLeft: pTd(16),
    paddingTop: pTd(16),
  },
  flatListContentContainerStyle: {
    paddingBottom: pTd(56),
    minHeight: '100%',
    position: 'relative',
  },
  topWrap: {
    paddingHorizontal: pTd(20),
  },
  sendAvatar: {
    marginTop: pTd(24),
  },
  sendBy: {
    marginTop: pTd(12),
    marginBottom: pTd(4),
  },
  memo: {
    textAlign: 'center',
    marginBottom: pTd(40),
  },
  tips: {
    marginTop: pTd(4),
  },
  divider: {
    marginTop: pTd(40),
    backgroundColor: defaultColors.bg6,
  },
  redPacketStyleIntro: {
    marginTop: pTd(16),
    paddingHorizontal: pTd(20),
  },
  bottomWrap: {
    // flex: 1,
    paddingTop: pTd(16),
    paddingHorizontal: pTd(20),
  },
  innerDivider: {
    marginTop: pTd(8),
    marginHorizontal: pTd(20),
  },
  listFooterComponentStyle: {
    width: screenWidth,
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: pTd(20),
  },
  bottomTips: {
    color: defaultColors.font3,
    textAlign: 'center',
  },
});
