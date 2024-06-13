import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { pTd } from 'utils/unit';
import { Share, StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import HeaderCard from '../components/HeaderCard';
import { View } from 'react-native';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import ReceiverItem from '../components/ReceiverItem';
import { useGetCryptoGiftDetail } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import { RedPackageGrabInfoItem } from '@portkey-wallet/im';
import { CryptoGiftOriginalStatus } from '@portkey-wallet/types/types-ca/cryptogift';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import Divider from 'components/Divider';

export default function GiftDetail() {
  const { t } = useLanguage();
  const { id } = useRouterParams<{ id: string }>();
  const { info, list, next, init } = useGetCryptoGiftDetail(id);
  const currentNetworkInfo = useCurrentNetworkInfo();
  useEffect(() => {
    init();
  }, [init]);
  const renderItem = useCallback(
    ({ item }: { item: RedPackageGrabInfoItem }) => {
      return (
        <ReceiverItem
          item={item}
          symbol={info?.symbol || 'token'}
          isLuckyKing={!!item && item.userId === info?.luckKingId}
          decimals={info?.decimal}
        />
      );
    },
    [info?.decimal, info?.luckKingId, info?.symbol],
  );
  const renderDivider = useCallback(() => {
    return <Divider style={styles.divider} />;
  }, []);
  const nextList = useCallback(() => {
    next();
  }, [next]);
  console.log('info', info?.grabbed);
  const statusTextShow = useMemo(() => {
    if (
      info?.status === CryptoGiftOriginalStatus.Init ||
      info?.status === CryptoGiftOriginalStatus.NotClaimed ||
      info?.status === CryptoGiftOriginalStatus.Claimed
    ) {
      return t(
        `Active, with ${info?.grabbed || '0'}/${info?.count || '--'} crypto gift(s) opened and ${
          info?.grabbedAmount ? formatTokenAmountShowWithDecimals(info?.grabbedAmount, info?.decimal) : '--'
        }/${info?.totalAmount ? formatTokenAmountShowWithDecimals(info?.totalAmount, info?.decimal) : '--'} ${
          info?.symbol || 'token'
        } claimed.`,
      );
    } else if (info?.status === CryptoGiftOriginalStatus.FullyClaimed) {
      return t(
        `Expired, with ${info?.grabbed || '0'}/${info?.count || '--'} crypto gift(s) opened and ${
          info?.grabbedAmount ? formatTokenAmountShowWithDecimals(info?.grabbedAmount, info?.decimal) : '--'
        }/${info?.totalAmount ? formatTokenAmountShowWithDecimals(info?.totalAmount, info?.decimal) : '--'} ${
          info?.symbol || 'token'
        } claimed.`,
      );
    }
    return `All claimed, with ${info?.grabbed || '0'}/${info?.count || '--'} crypto gift(s) opened and ${
      info?.grabbedAmount ? formatTokenAmountShowWithDecimals(info?.grabbedAmount, info?.decimal) : '--'
    }/${info?.totalAmount ? formatTokenAmountShowWithDecimals(info?.totalAmount, info?.decimal) : '--'} ${
      info?.symbol || 'token'
    } claimed.`;
  }, [
    info?.status,
    info?.grabbed,
    info?.count,
    info?.grabbedAmount,
    info?.totalAmount,
    info?.symbol,
    info?.decimal,
    t,
  ]);
  const shareUrl = useMemo(() => {
    return `${currentNetworkInfo.referralUrl}/cryptoGift?id=${id}`;
  }, [currentNetworkInfo.referralUrl, id]);
  const onSharePress = useCallback(async () => {
    await Share.share({
      message: 'Crypto Gift',
      url: shareUrl,
      title: 'Crypto Gift',
    }).catch(shareError => {
      console.log(shareError);
    });
  }, [shareUrl]);
  return (
    <PageContainer
      noCenterDom
      rightDom={
        <Touchable onPress={onSharePress}>
          <Svg size={pTd(22)} icon="share-gift" iconStyle={styles.iconMargin} />
        </Touchable>
      }
      containerStyles={styles.pageStyles}
      safeAreaColor={['white']}>
      <FlatList
        ListHeaderComponent={() => (
          <>
            <HeaderCard memo={info?.memo} />
            {renderDivider()}
            <TextM style={[FontStyles.neutralTertiaryText, GStyles.marginTop(pTd(16)), GStyles.paddingArg(0, pTd(16))]}>
              {statusTextShow}
            </TextM>
            <View
              style={[
                GStyles.paddingArg(0, pTd(16)),
                BGStyles.neutralDivider,
                GStyles.height(pTd(0.5)),
                GStyles.marginTop(pTd(8)),
              ]}
            />
          </>
        )}
        onEndReached={nextList}
        contentContainerStyle={{ paddingBottom: pTd(10) }}
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={renderItem}
        keyExtractor={(item: any, index: number) => '' + (item?.id || index)}
      />
    </PageContainer>
  );
}
const styles = StyleSheet.create({
  pageStyles: {
    backgroundColor: defaultColors.neutralDefaultBG,
    flex: 1,
    paddingHorizontal: 0,
  },
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg1,
    flex: 1,
    ...GStyles.paddingArg(0),
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
  iconMargin: { marginRight: pTd(16) },
  itemDivider: {
    marginTop: pTd(16),
    ...GStyles.paddingArg(0, pTd(16)),
  },
  divider: {
    height: pTd(8),
    backgroundColor: defaultColors.neutralContainerBG,
    marginTop: pTd(32),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listFooterComponentStyle: {
    width: screenWidth,
    marginTop: 20,
    // position: 'absolute',
    bottom: 0,
    paddingHorizontal: pTd(20),
  },
  bottomTips: {
    color: defaultColors.font3,
    textAlign: 'center',
  },
});
