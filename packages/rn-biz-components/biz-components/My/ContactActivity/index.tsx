import { ChainId } from '@portkey-wallet/types';
import { addressFormat, formatChainInfoToShow, getExploreLink, sleep } from '@portkey-wallet/utils';
import { useRoute, RouteProp } from '@portkey-wallet/rn-inject-sdk';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import { BGStyles, FontStyles } from '@portkey-wallet/rn-base/assets/theme/styles';
import { TextL, TextM, TextS } from '@portkey-wallet/rn-components/components/CommonText';
// import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import PageContainer from '@portkey-wallet/rn-components/components/PageContainer';
import Svg from '@portkey-wallet/rn-components/components/Svg';
// import { setStringAsync } from 'expo-clipboard';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import NoData from '@portkey-wallet/rn-components/components/NoData';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { NFT_MIDDLE_SIZE } from '@portkey-wallet/constants/constants-ca/assets';
import { request } from '@portkey-wallet/api/api-did';
import myEvents from '@portkey-wallet/rn-base/utils/deviceEvent';
import { IActivityListWithAddressApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import CommonAvatar from '@portkey-wallet/rn-components/components/CommonAvatar';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import ActivityItem from '@portkey-wallet/rn-components/components/ActivityItem';
import { ListLoadingEnum } from '@portkey-wallet/rn-base/constants/misc';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { FlatListFooterLoading } from '@portkey-wallet/rn-components/components/FlatListFooterLoading';
import { FlashList } from '@shopify/flash-list';
import { copyText } from '@portkey-wallet/rn-base/utils';

interface ParamsType {
  fromChainId: ChainId;
  address: string;
  chainId: ChainId;
  contactName?: string;
  avatar?: string;
}

const MAX_RESULT_COUNT = 20;

const ContactActivity: React.FC = () => {
  const {
    params: { fromChainId, address, chainId, contactName, avatar },
  } = useRoute<RouteProp<{ params: ParamsType }>>();

  const { t } = useLanguage();
  const { explorerUrl } = useCurrentChain(chainId) ?? {};
  const caAddressInfos = useCaAddressInfoList();

  const [addressName, setAddressName] = useState<string | undefined>(contactName);
  const [addressAvatar, setAddressAvatar] = useState<string | undefined>(avatar);

  const [totalCount, setTotalCount] = useState(0);
  const [activityList, setActivityList] = useState<ActivityItemType[]>([]);
  const activityListRef = useRef(activityList);
  activityListRef.current = activityList;

  const params: IActivityListWithAddressApiParams = useMemo(
    () => ({
      maxResultCount: MAX_RESULT_COUNT,
      skipCount: activityList.length,
      caAddressInfos: caAddressInfos.filter(ele => ele.chainId === fromChainId),
      targetAddressInfos: [
        {
          caAddress: address,
          chainId: chainId,
          chainName: '',
        },
      ],
      width: NFT_MIDDLE_SIZE,
      height: -1,
    }),
    [activityList.length, address, caAddressInfos, chainId, fromChainId],
  );

  const [isLoading, setIsLoading] = useState(ListLoadingEnum.hide);
  const fetchActivityList = useLockCallback(
    async (skipActivityNumber = 0) => {
      const newParams = {
        ...params,
        skipCount: skipActivityNumber,
      };

      setIsLoading(skipActivityNumber === 0 ? ListLoadingEnum.header : ListLoadingEnum.footer);

      const result = await request.activity.activityListWithAddress({ params: newParams });

      if (skipActivityNumber === 0) {
        // init
        setActivityList(result.data);
      } else {
        setActivityList([...activityList, ...result.data]);
      }

      setTotalCount(result.totalRecordCount);
      setIsLoading(ListLoadingEnum.hide);
      if (skipActivityNumber !== 0) await sleep(250);
    },
    [activityList, params],
  );

  const copyAddress = useCallback(
    async (str: string) => {
      copyText(str);
      // const isCopy = await setStringAsync(str);
      // isCopy && CommonToast.success(t('Copy Success'));
    },
    [t],
  );

  const renderItem = useCallback(({ item, index }: { item: ActivityItemType; index: number }) => {
    const preItem = activityListRef.current?.[index - 1];
    return (
      <ActivityItem
        preItem={preItem}
        index={index}
        item={item}
        onPress={() => navigationService.navigate('ActivityDetail', item)}
      />
    );
  }, []);

  const navToAddContact = useCallback(() => {
    navigationService.navigate('NoChatContactProfileEdit', {
      addressList: [{ address, chainId }],
    });
  }, [address, chainId]);

  const navToExplore = useCallback(
    (navAddress: string, navChainId: ChainId) => {
      if (!address) return;

      navigationService.navigate('ViewOnWebView', {
        title: t('View on Explorer'),
        url: getExploreLink(explorerUrl || '', addressFormat(navAddress, navChainId), 'address'),
      });
    },
    [address, explorerUrl, t],
  );

  useEffect(() => {
    const listener = myEvents.refreshMyContactDetailInfo.addListener(({ contactName: name, contactAvatar }) => {
      setAddressName(name);
      setAddressAvatar(contactAvatar);
    });
    return () => listener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isInitRef = useRef(false);
  const init = useCallback(async () => {
    await sleep(250);
    await fetchActivityList(0);
    isInitRef.current = true;
  }, [fetchActivityList]);

  const isEmpty = useMemo(() => activityList.length === 0, [activityList.length]);

  return (
    <PageContainer
      titleDom={t('Details')}
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: true }}
      containerStyles={[styles.container, BGStyles.bg1]}>
      <View style={styles.topSection}>
        {!!addressName && (
          <>
            <TextM style={FontStyles.font3}>{t('Name')}</TextM>
            <View style={[GStyles.flexRow, BGStyles.bg1, styles.nameSection]}>
              <CommonAvatar
                hasBorder
                resizeMode="cover"
                title={addressName.toUpperCase() || contactName}
                avatarSize={pTd(36)}
                imageUrl={addressAvatar || ''}
                style={styles.itemAvatar}
              />
              <TextL>{addressName || contactName || ''}</TextL>
            </View>
          </>
        )}
        <>
          <TextM style={FontStyles.font3}>{t('Address')}</TextM>
          <View style={[styles.addressSection, BGStyles.bg1]}>
            <TextM style={styles.addressStr}>{addressFormat(address, chainId, 'aelf')}</TextM>
            <TextS style={styles.chainInfo}>{formatChainInfoToShow(chainId)}</TextS>
            <View style={styles.handleWrap}>
              {!addressName && (
                <Touchable style={styles.handleIconItem} onPress={navToAddContact}>
                  <Svg icon="add-contact" size={pTd(20)} />
                </Touchable>
              )}
              <Touchable
                style={styles.handleIconItem}
                onPress={() => copyAddress(addressFormat(address, chainId, 'aelf'))}>
                <Svg color={defaultColors.font4} icon="copy3" size={pTd(20)} />
              </Touchable>
              <Touchable style={styles.handleIconItem} onPress={() => navToExplore(address, chainId)}>
                <Svg icon="share2" size={pTd(20)} />
              </Touchable>
            </View>
          </View>
        </>
      </View>

      <FlashList
        refreshing={isLoading === ListLoadingEnum.header}
        data={activityList ?? []}
        keyExtractor={(_item, index) => `${index}`}
        ListEmptyComponent={<NoData noPic message="" />}
        renderItem={renderItem}
        onRefresh={() => init()}
        onEndReached={() => {
          if (!isInitRef.current) return;
          if (activityList?.length >= totalCount) return;
          fetchActivityList(activityList?.length);
        }}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListFooterComponent={
          <>{!isEmpty && <FlatListFooterLoading refreshing={isLoading === ListLoadingEnum.footer} />}</>
        }
        onLoad={() => {
          if (isInitRef.current) return;
          init();
        }}
      />
    </PageContainer>
  );
};

export default ContactActivity;

const styles = StyleSheet.create({
  container: {
    ...GStyles.paddingArg(0, 0),
  },
  itemAvatar: {
    marginRight: pTd(10),
  },
  topSection: {
    ...GStyles.paddingArg(24, 20),
    backgroundColor: defaultColors.bg4,
  },
  nameSection: {
    marginTop: pTd(8),
    marginBottom: pTd(16),
    ...GStyles.paddingArg(10, 16),
    alignItems: 'center',
    borderRadius: pTd(6),
  },
  addressSection: {
    marginTop: pTd(8),
    ...GStyles.paddingArg(16),
    borderRadius: pTd(6),
  },
  addressStr: {
    lineHeight: pTd(20),
  },
  chainInfo: {
    marginTop: pTd(8),
    color: defaultColors.font3,
  },
  handleWrap: {
    marginTop: pTd(16),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  handleIconItem: {
    marginLeft: pTd(40),
  },
});
