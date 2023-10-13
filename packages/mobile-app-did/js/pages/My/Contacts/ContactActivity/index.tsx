import { ChainId } from '@portkey-wallet/types';
import { addressFormat, formatChainInfoToShow, getExploreLink } from '@portkey-wallet/utils';
import { useRoute, RouteProp } from '@react-navigation/native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { TextL, TextM, TextS, TextXXL } from 'components/CommonText';
import CommonToast from 'components/CommonToast';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import { setStringAsync } from 'expo-clipboard';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import TransferItem from 'components/TransferList/components/TransferItem';
import NoData from 'components/NoData';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { NFT_MIDDLE_SIZE } from '@portkey-wallet/constants/constants-ca/assets';
import { request } from '@portkey-wallet/api/api-did';
import myEvents from 'utils/deviceEvent';
import { IActivityListWithAddressApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';

interface ParamsType {
  fromChainId: ChainId;
  address: string;
  chainId: ChainId;
  contactName?: string;
}

const MAX_RESULT_COUNT = 10;

const ContactActivity: React.FC = () => {
  const {
    params: { fromChainId, address, chainId, contactName },
  } = useRoute<RouteProp<{ params: ParamsType }>>();

  const { t } = useLanguage();
  const { explorerUrl } = useCurrentChain(chainId) ?? {};
  const caAddressInfos = useCaAddressInfoList();

  const [addressName, setAddressName] = useState<string | undefined>(contactName);

  const [isFetching, setIsFetching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [activityList, setActivityList] = useState<ActivityItemType[]>([]);

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

  const fetchActivityList = useCallback(
    async (skipActivityNumber = 0) => {
      if (isFetching) return;
      const newParams = {
        ...params,
        skipCount: skipActivityNumber,
      };

      setIsFetching(true);

      const result = await request.activity.activityListWithAddress({ params: newParams });

      if (skipActivityNumber === 0) {
        // init
        setActivityList(result.data);
      } else {
        setActivityList([...activityList, ...result.data]);
      }

      setTotalCount(result.totalRecordCount);
      setIsFetching(false);
    },
    [activityList, isFetching, params],
  );

  const copyAddress = useCallback(
    async (str: string) => {
      const isCopy = await setStringAsync(str);
      isCopy && CommonToast.success(t('Copy Success'));
    },
    [t],
  );

  const renderItem = useCallback(({ item }: { item: ActivityItemType }) => {
    return <TransferItem item={item} onPress={() => navigationService.navigate('ActivityDetail', item)} />;
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
    init();
    const listener = myEvents.refreshMyContactDetailInfo.addListener(({ contactName: name }) => setAddressName(name));
    return () => listener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = useCallback(() => {
    fetchActivityList(0);
  }, [fetchActivityList]);

  return (
    <PageContainer
      titleDom={t('Details')}
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: true }}
      containerStyles={[styles.container, BGStyles.bg4]}>
      <View style={styles.topSection}>
        {!!addressName && (
          <>
            <TextM style={FontStyles.font3}>{t('Name')}</TextM>
            <View style={[GStyles.flexRow, BGStyles.bg1, styles.nameSection]}>
              <View style={styles.itemAvatar}>
                <TextXXL>{addressName.match(/^[a-zA-Z]/) ? addressName.slice(0, 1).toUpperCase() : '#'}</TextXXL>
              </View>
              <TextL>{addressName}</TextL>
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
                <TouchableOpacity style={styles.handleIconItem} onPress={navToAddContact}>
                  <Svg icon="add-contact" size={pTd(20)} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.handleIconItem}
                onPress={() => copyAddress(addressFormat(address, chainId, 'aelf'))}>
                <Svg color={defaultColors.font4} icon="copy3" size={pTd(20)} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.handleIconItem} onPress={() => navToExplore(address, chainId)}>
                <Svg icon="share2" size={pTd(20)} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      </View>

      <FlatList
        style={styles.flatListWrap}
        refreshing={false}
        onRefresh={() => init()}
        data={activityList ?? []}
        renderItem={renderItem}
        onEndReached={() => {
          if (isFetching) return;
          if (activityList?.length >= totalCount) return;
          fetchActivityList(activityList?.length);
        }}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListEmptyComponent={<NoData noPic message="" />}
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border1,
    width: pTd(36),
    height: pTd(36),
    borderRadius: pTd(23),
    backgroundColor: defaultColors.bg4,
    marginRight: pTd(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topSection: {
    ...GStyles.paddingArg(24, 20),
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
  flatListWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
  },
});
