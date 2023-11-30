import React, { useMemo } from 'react';
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
import { useGetRedPackageDetail, useIsMyRedPacket } from '@portkey-wallet/hooks/hooks-ca/im';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { RedPackageDetail, RedPackageTypeEnum } from '@portkey-wallet/im';
import { divDecimalsStr } from '@portkey-wallet/utils/converter';
import { useEffectOnce } from '@portkey-wallet/hooks';

export type RedPacketRouterParams = {
  redPacketId: string;
  data: RedPackageDetail;
};

export const RedPacketDetails = () => {
  const { redPacketId, data } = useRouterParams<RedPacketRouterParams>();

  const { info, list, init } = useGetRedPackageDetail();
  const redPacketData = useMemo(() => info || data, [data, info]);

  console.log('redPacketDataredPacketDataredPacketData', redPacketData);
  const isMyPacket = useIsMyRedPacket(redPacketData?.senderId);
  const isP2P = useMemo(() => redPacketData?.type === RedPackageTypeEnum.P2P, [redPacketData?.type]);

  const isShowBottomTips = useMemo(() => {
    if (isP2P && redPacketData?.isRedPackageExpired && isMyPacket) return true;
    if (!isP2P && !redPacketData?.isRedPackageFullyClaimed) return true;

    return false;
  }, [isMyPacket, isP2P, redPacketData?.isRedPackageExpired, redPacketData?.isRedPackageFullyClaimed]);

  useEffectOnce(() => {
    init({ id: redPacketId });
  });

  const renderRedPacketTipContent = useMemo(() => {
    // isP2P && my packet && isRedPackageFullyClaimed
    if (isP2P && isMyPacket && redPacketData?.isRedPackageFullyClaimed)
      return `This crypto box was opened, with ${divDecimalsStr(redPacketData?.totalAmount, redPacketData?.decimal)} ${
        redPacketData?.symbol
      } claimed.`;

    // isP2P && my packet && !isRedPackageFullyClaimed
    if (isP2P && isMyPacket && !redPacketData?.isRedPackageFullyClaimed)
      return `${divDecimalsStr(redPacketData?.totalAmount, redPacketData?.decimal)} ${
        redPacketData?.symbol
      } to be claimed.`;

    // isP2P && my packet && isRedPackageFullyClaimed && expired
    if (isP2P && isMyPacket && redPacketData?.isRedPackageFullyClaimed && redPacketData?.isRedPackageExpired)
      return `Crypto box expired. It was not opened, with ${divDecimalsStr(
        redPacketData?.totalAmount,
        redPacketData?.decimal,
      )} ${redPacketData?.symbol} unclaimed.`;

    // !isP2P  && !isRedPackageFullyClaimed & expired
    if (!isP2P && !redPacketData?.isRedPackageFullyClaimed && redPacketData?.isRedPackageExpired)
      return `Crypto box(es) expired, with ${redPacketData?.grabbed}/${
        redPacketData?.count
      } opened and ${divDecimalsStr(redPacketData?.grabbedAmount, redPacketData?.decimal)}/${divDecimalsStr(
        redPacketData?.totalAmount,
        redPacketData?.decimal,
      )} ${redPacketData?.symbol} claimed.`;

    // !isP2P  && !isRedPackageFullyClaimed & !expired
    if (!isP2P && !redPacketData?.isRedPackageFullyClaimed && !redPacketData?.isRedPackageExpired)
      return `${redPacketData?.grabbed}/${redPacketData?.count} crypto box(es) opened, with ${divDecimalsStr(
        redPacketData?.grabbedAmount,
        redPacketData?.decimal,
      )}/${divDecimalsStr(redPacketData?.totalAmount, redPacketData?.decimal)} ${redPacketData?.symbol} claimed.`;

    // !isP2P  && !isRedPackageFullyClaimed & !expired
    if (!isP2P && !redPacketData?.isRedPackageFullyClaimed && !redPacketData?.isRedPackageExpired)
      return `${redPacketData?.grabbed}/${redPacketData?.count} crypto box(es) opened, with ${divDecimalsStr(
        redPacketData?.grabbedAmount,
        redPacketData?.decimal,
      )}/${divDecimalsStr(redPacketData?.totalAmount, redPacketData?.decimal)} ${redPacketData?.symbol} claimed.`;

    return '';
  }, [
    isMyPacket,
    isP2P,
    redPacketData?.count,
    redPacketData?.decimal,
    redPacketData?.grabbed,
    redPacketData?.grabbedAmount,
    redPacketData?.isRedPackageExpired,
    redPacketData?.isRedPackageFullyClaimed,
    redPacketData?.symbol,
    redPacketData?.totalAmount,
  ]);

  const headerDom = useMemo(() => {
    return (
      <View style={[GStyles.center, styles.topWrap]}>
        <CommonAvatar
          resizeMode="cover"
          style={styles.sendAvatar}
          avatarSize={pTd(48)}
          title={redPacketData?.senderName}
          imageUrl={redPacketData?.senderAvatar}
        />
        <TextXL numberOfLines={1} style={[FontStyles.font5, styles.sendBy]}>
          {`Red Packet Sent by ${redPacketData?.senderName}`}
        </TextXL>
        <TextM style={[FontStyles.font7, styles.memo]}>{redPacketData?.memo}</TextM>

        {redPacketData.isCurrentUserGrabbed && (
          <>
            <RedPacketAmountShow
              componentType="packetDetailPage"
              amountShow={divDecimalsStr(redPacketData?.grabbedAmount, redPacketData?.decimal)}
              symbol={redPacketData?.symbol || ''}
            />
            <TextS style={[FontStyles.font15, styles.tips]}>Red Packet transferred to Wallet</TextS>
          </>
        )}
      </View>
    );
  }, [
    redPacketData?.decimal,
    redPacketData?.grabbedAmount,
    redPacketData.isCurrentUserGrabbed,
    redPacketData?.memo,
    redPacketData?.senderAvatar,
    redPacketData?.senderName,
    redPacketData?.symbol,
  ]);

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
      <View style={GStyles.flex1}>
        {!isMyPacket && redPacketData.isRedPackageFullyClaimed ? (
          headerDom
        ) : (
          <FlatList
            contentContainerStyle={styles.flatListContentContainerStyle}
            data={list}
            ListHeaderComponent={() => (
              <>
                {headerDom}
                {redPacketData.isCurrentUserGrabbed && <Divider width={pTd(8)} style={styles.divider} />}
                <TextM style={[FontStyles.font7, styles.redPacketStyleIntro]}>{renderRedPacketTipContent}</TextM>
                <Divider style={styles.innerDivider} />
              </>
            )}
            renderItem={({ item }) => (
              <RedPacketReceiverItem
                key={item.userId}
                item={item}
                symbol={redPacketData?.symbol}
                decimals={redPacketData?.decimal}
              />
            )}
            ListFooterComponentStyle={styles.listFooterComponentStyle}
            ListFooterComponent={() =>
              isShowBottomTips ? (
                <TextM style={styles.bottomTips}>
                  Unclaimed tokens have been automatically returned to the sender.
                </TextM>
              ) : null
            }
          />
        )}
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
    paddingHorizontal: pTd(12),
  },
  bottomWrap: {
    // flex: 1,
    paddingTop: pTd(16),
    paddingHorizontal: pTd(12),
  },
  innerDivider: {
    marginTop: pTd(8),
    marginHorizontal: pTd(12),
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
