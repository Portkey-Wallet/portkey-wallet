import React, { useCallback, useMemo, useState } from 'react';
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
import {
  NextRedPackageDetailResult,
  useGetRedPackageDetail,
  useIsMyRedPacket,
} from '@portkey-wallet/hooks/hooks-ca/im';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { RedPackageTypeEnum } from '@portkey-wallet/im';
import { divDecimalsStr, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { formatRedPacketNoneLeftTime, getNumberWithUnit, getUnit } from '../utils/format';
import NFTAvatar from 'components/NFTAvatar';
import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';

export type RedPacketRouterParams = {
  redPacketId: string;
  data?: NextRedPackageDetailResult;
};

export const RedPacketDetails = () => {
  const { redPacketId, data } = useRouterParams<RedPacketRouterParams>();

  const { info, list: _list, init, next } = useGetRedPackageDetail(redPacketId);
  const redPacketData = useMemo(() => info || data?.info, [data, info]);
  const list = useMemo(() => _list || data?.list || [], [_list, data?.list]);

  const isMyPacket = useIsMyRedPacket(redPacketData?.senderId || '');
  const isP2P = useMemo(() => redPacketData?.type === RedPackageTypeEnum.P2P, [redPacketData?.type]);
  const luckKingId = useMemo(() => redPacketData?.luckKingId || '', [redPacketData?.luckKingId]);

  const isShowBottomTips = useMemo(() => {
    if (!isMyPacket) return false;
    if (redPacketData?.isRedPackageExpired && !redPacketData?.isRedPackageFullyClaimed) return true;

    return false;
  }, [isMyPacket, redPacketData?.isRedPackageExpired, redPacketData?.isRedPackageFullyClaimed]);

  const [, resetOverlayCount] = useState(0);

  useEffectOnce(() => {
    init();
  });

  const renderRedPacketTipContent = useMemo(() => {
    const tokenUnit =
      redPacketData?.assetType === AssetType.ft ? redPacketData?.symbol : `${redPacketData?.alias} NFTs`;

    // isP2P && my packet && isRedPackageFullyClaimed
    if (isP2P && isMyPacket && redPacketData?.isRedPackageFullyClaimed)
      return `This crypto box was opened, with ${divDecimalsStr(
        redPacketData?.totalAmount,
        redPacketData?.decimal,
      )} ${tokenUnit} claimed.`;

    // isP2P && my packet && !isRedPackageFullyClaimed && !expired
    if (isP2P && isMyPacket && !redPacketData?.isRedPackageFullyClaimed && !redPacketData?.isRedPackageExpired)
      return `${divDecimalsStr(redPacketData?.totalAmount, redPacketData?.decimal)} ${tokenUnit} to be claimed.`;

    // isP2P && my packet && !isRedPackageFullyClaimed && expired
    if (isP2P && isMyPacket && !redPacketData?.isRedPackageFullyClaimed && redPacketData?.isRedPackageExpired)
      return `Crypto box expired. It was not opened, with ${divDecimalsStr(
        redPacketData?.totalAmount,
        redPacketData?.decimal,
      )} ${tokenUnit} unclaimed.`;

    // !isP2P  && my wallet && isRedPackageFullyClaimed
    if (!isP2P && isMyPacket && redPacketData?.isRedPackageFullyClaimed)
      return `${getNumberWithUnit(redPacketData?.count, 'crypto box', 'crypto boxes')} with ${divDecimalsStr(
        redPacketData?.totalAmount,
        redPacketData?.decimal,
      )} ${tokenUnit} in total, opened in ${formatRedPacketNoneLeftTime(
        redPacketData?.createTime,
        redPacketData?.endTime,
      )}`;

    // !isP2P  && my wallet && !isRedPackageFullyClaimed & isRedPackageExpired
    if (!isP2P && isMyPacket && !redPacketData?.isRedPackageFullyClaimed && redPacketData?.isRedPackageExpired)
      return `Crypto ${getUnit(redPacketData?.count || 1, 'box', 'boxes')} expired, with ${redPacketData?.grabbed}/${
        redPacketData?.count
      } opened and  ${divDecimalsStr(redPacketData?.grabbedAmount, redPacketData?.decimal)}/${divDecimalsStr(
        redPacketData?.totalAmount,
        redPacketData?.decimal,
      )} ${tokenUnit} claimed.`;

    // !isP2P  && my wallet && !isRedPackageFullyClaimed && !isRedPackageExpired
    if (!isP2P && isMyPacket && !redPacketData?.isRedPackageFullyClaimed && !redPacketData?.isRedPackageExpired)
      return `${redPacketData?.grabbed}/${redPacketData?.count} crypto ${getUnit(
        redPacketData?.count || 1,
        'box',
        'boxes',
      )} opened, with ${divDecimalsStr(redPacketData?.grabbedAmount, redPacketData?.decimal, '0')}/${divDecimalsStr(
        redPacketData?.totalAmount,
        redPacketData?.decimal,
      )} ${tokenUnit} claimed.`;

    // !isP2P  && !my wallet  && isRedPackageFullyClaimed
    if (!isP2P && !isMyPacket && redPacketData?.isRedPackageFullyClaimed)
      return `${getNumberWithUnit(
        redPacketData?.count,
        'crypto box',
        'crypto boxes',
      )} opened in ${formatRedPacketNoneLeftTime(redPacketData?.createTime, redPacketData?.endTime)}`;

    // !isP2P  && !my wallet  && !isRedPackageFullyClaimed &&  isRedPackageExpired
    if (!isP2P && !isMyPacket && !redPacketData?.isRedPackageFullyClaimed && redPacketData?.isRedPackageExpired)
      return `Crypto ${getUnit(redPacketData?.count || 1, 'box', 'boxes')} expired,  ${redPacketData?.grabbed} opened.`;

    // !isP2P  && !my wallet  && !isRedPackageFullyClaimed &&  !isRedPackageExpired
    if (!isP2P && !isMyPacket && !redPacketData?.isRedPackageFullyClaimed && !redPacketData?.isRedPackageExpired)
      return `${redPacketData?.grabbed}/${redPacketData?.count} crypto ${getUnit(
        redPacketData?.grabbed || 1,
        'box',
        'boxes',
      )} opened.`;
    return '';
  }, [
    isMyPacket,
    isP2P,
    redPacketData?.alias,
    redPacketData?.assetType,
    redPacketData?.count,
    redPacketData?.createTime,
    redPacketData?.decimal,
    redPacketData?.endTime,
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
        <View style={styles.headerTitleWrap}>
          <CommonAvatar
            hasBorder
            resizeMode="cover"
            avatarSize={pTd(24)}
            style={styles.sendAvatar}
            titleStyle={FontStyles.size14}
            title={redPacketData?.senderName}
            imageUrl={redPacketData?.senderAvatar}
          />

          <TextXL numberOfLines={1} style={[FontStyles.font5, FontStyles.weight500]}>
            {`Crypto Box from ${redPacketData?.senderName}`}
          </TextXL>
        </View>

        <TextM
          style={[
            FontStyles.font7,
            styles.memo,
            redPacketData?.assetType === AssetType.nft && GStyles.marginBottom(24),
          ]}>
          {redPacketData?.memo}
        </TextM>

        {redPacketData?.assetType === AssetType.nft && (
          <NFTAvatar
            disabled
            showNftDetailInfo
            isSeed={redPacketData?.isSeed}
            seedType={redPacketData?.seedType}
            badgeSizeType="normal"
            style={GStyles.marginBottom(16)}
            data={{
              imageUrl: redPacketData?.imageUrl || '',
              alias: redPacketData?.alias || '',
              tokenId: redPacketData?.tokenId || '',
            }}
          />
        )}
        {redPacketData?.isCurrentUserGrabbed && (
          <>
            <RedPacketAmountShow
              assetType={redPacketData?.assetType}
              componentType="packetDetailPage"
              amountShow={formatTokenAmountShowWithDecimals(
                redPacketData?.currentUserGrabbedAmount,
                redPacketData?.decimal,
              )}
              symbol={redPacketData.assetType === AssetType.ft ? redPacketData?.symbol : ''}
            />
            <TextS style={[FontStyles.font15, styles.tips]}>
              {`You can find the claiming record in the "Activity" section.`}
            </TextS>
          </>
        )}
      </View>
    );
  }, [
    redPacketData?.alias,
    redPacketData?.assetType,
    redPacketData?.currentUserGrabbedAmount,
    redPacketData?.decimal,
    redPacketData?.imageUrl,
    redPacketData?.isCurrentUserGrabbed,
    redPacketData?.isSeed,
    redPacketData?.memo,
    redPacketData?.seedType,
    redPacketData?.senderAvatar,
    redPacketData?.senderName,
    redPacketData?.symbol,
    redPacketData?.tokenId,
  ]);

  const nextList = useCallback(() => {
    next();
  }, [next]);

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
      <View style={GStyles.flex1} onLayout={() => resetOverlayCount(pre => pre + 1)}>
        {isP2P && !isMyPacket && redPacketData?.isRedPackageFullyClaimed ? (
          headerDom
        ) : (
          <FlatList
            contentContainerStyle={styles.flatListContentContainerStyle}
            data={list}
            ListHeaderComponent={() => (
              <>
                {headerDom}
                {redPacketData?.isCurrentUserGrabbed && <Divider width={pTd(8)} style={styles.divider} />}
                <TextM style={[FontStyles.font7, styles.redPacketStyleIntro]}>{renderRedPacketTipContent}</TextM>
                <Divider style={styles.innerDivider} />
              </>
            )}
            renderItem={({ item }) => (
              <RedPacketReceiverItem
                key={item.userId}
                item={item}
                symbol={redPacketData?.assetType === AssetType.ft ? redPacketData?.symbol : ''}
                decimals={redPacketData?.decimal}
                isLuckyKing={item.userId === luckKingId}
              />
            )}
            onEndReached={nextList}
            ListFooterComponentStyle={styles.listFooterComponentStyle}
            ListFooterComponent={() =>
              isShowBottomTips ? (
                <TextM style={styles.bottomTips}>
                  {'Unclaimed tokens/NFTs have been automatically returned to the sender.'}
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
    paddingVertical: pTd(16),
    width: pTd(60),
  },
  flatListContentContainerStyle: {
    paddingBottom: pTd(56),
    minHeight: '100%',
    position: 'relative',
  },
  topWrap: {
    paddingHorizontal: pTd(20),
  },
  headerTitleWrap: {
    marginTop: pTd(24),
    marginBottom: pTd(4),
    paddingHorizontal: pTd(12),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendAvatar: {
    marginRight: pTd(8),
  },
  memo: {
    textAlign: 'center',
    marginBottom: pTd(40),
  },
  tips: {
    marginTop: pTd(4),
  },
  divider: {
    marginTop: pTd(24),
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
