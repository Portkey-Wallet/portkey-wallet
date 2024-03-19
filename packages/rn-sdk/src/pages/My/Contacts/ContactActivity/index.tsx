import { ChainId } from '@portkey-wallet/types';
import { addressFormat, formatChainInfoToShow, getExploreLink } from '@portkey-wallet/utils';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { TextL, TextM, TextS } from 'components/CommonText';
import CommonToast from 'components/CommonToast';
import CommonSvg from 'components/Svg';
import { setStringAsync } from 'expo-clipboard';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { pTd } from 'utils/unit';
import TransferItem from 'components/TransferList/components/TransferItem';
import NoData from 'components/NoData';
import SafeAreaBox from 'components/SafeAreaBox';
import CustomHeader from 'components/CustomHeader';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { getUnlockedWallet, useUnlockedWallet } from 'model/wallet';
import { NFT_MIDDLE_SIZE } from '@portkey-wallet/constants/constants-ca/assets';
import myEvents from 'utils/deviceEvent';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import CommonAvatar from 'components/CommonAvatar';
import { NetworkController } from 'network/controller';
import useBaseContainer from 'model/container/UseBaseContainer';
import { getStatusBarHeight } from 'utils/screen';
import { PortkeyEntries } from 'config/entries';
import { ActivityDetailPropsType } from 'pages/Activity/ActivityDetail';
import { ViewOnWebViewProps } from 'pages/Activity/ViewOnWebView';
import { useCommonNetworkInfo } from 'components/TokenOverlay/hooks';

interface ParamsType {
  fromChainId: ChainId;
  address: string;
  chainId: ChainId;
  contactName?: string;
  avatar?: string;
}

const MAX_RESULT_COUNT = 10;

const ContactActivity = ({ address, chainId, contactName, avatar }: ParamsType) => {
  const { t } = useLanguage();
  const { navigateTo, onFinish } = useBaseContainer({});
  const { wallet } = useUnlockedWallet({ getMultiCaAddresses: true });
  const { explorerUrl } = useCommonNetworkInfo(chainId);

  const [addressName, setAddressName] = useState<string | undefined>(contactName);
  const [addressAvatar, setAddressAvatar] = useState<string | undefined>(avatar);

  const [isFetching, setIsFetching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [activityList, setActivityList] = useState<ActivityItemType[]>([]);

  const params = useMemo(
    () => ({
      maxResultCount: MAX_RESULT_COUNT,
      skipCount: activityList.length,
      targetAddressInfos: [
        {
          caAddress: address,
          chainId: chainId,
        },
      ],
      width: NFT_MIDDLE_SIZE,
      height: -1,
    }),
    [activityList.length, address, chainId],
  );

  const fetchActivityList = useCallback(
    async (skipActivityNumber = 0) => {
      const { multiCaAddresses } = await getUnlockedWallet({ getMultiCaAddresses: true });
      if (isFetching) return;
      const newParams = {
        ...params,
        caAddressInfos: Object.entries(multiCaAddresses)
          .map(it => {
            return { chainId: it[0], caAddress: it[1] };
          })
          .filter(it => it.chainId === chainId),
        skipCount: skipActivityNumber,
      };

      setIsFetching(true);

      const result = await NetworkController.getActivityListWithAddress(newParams);

      if (skipActivityNumber === 0) {
        // init
        setActivityList(result.data);
      } else {
        setActivityList([...activityList, ...result.data]);
      }

      setTotalCount(result.totalRecordCount);
      setIsFetching(false);
    },
    [activityList, chainId, isFetching, params],
  );

  const copyAddress = useCallback(
    async (str: string) => {
      const isCopy = await setStringAsync(str);
      isCopy && CommonToast.success(t('Copy Success'));
    },
    [t],
  );

  const renderItem = useCallback(
    ({ item }: { item: ActivityItemType }) => {
      return (
        <TransferItem
          item={item}
          onPress={() => {
            if (!wallet) return;
            const { multiCaAddresses } = wallet;
            navigateTo<ActivityDetailPropsType>(PortkeyEntries.ACTIVITY_DETAIL_ENTRY, {
              params: {
                item,
                caAddressInfos: Object.entries(multiCaAddresses).map(([itemChainId, caAddress]) => {
                  return {
                    chainId: itemChainId,
                    caAddress,
                  };
                }),
              },
            });
          }}
        />
      );
    },
    [navigateTo, wallet],
  );

  const navToExplore = useCallback(
    (navAddress: string, navChainId: ChainId) => {
      if (!address) return;
      navigateTo<ViewOnWebViewProps>(PortkeyEntries.VIEW_ON_WEBVIEW, {
        params: {
          title: t('View on Explorer'),
          url: getExploreLink(explorerUrl || '', addressFormat(navAddress, navChainId), 'address'),
        },
      });
    },
    [address, explorerUrl, navigateTo, t],
  );

  useEffect(() => {
    init();
    const listener = myEvents.refreshMyContactDetailInfo.addListener(({ contactName: name, contactAvatar }) => {
      setAddressName(name);
      setAddressAvatar(contactAvatar);
    });
    return () => listener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = useCallback(() => {
    fetchActivityList(0);
  }, [fetchActivityList]);

  const goBack = useCallback(() => {
    onFinish({
      status: 'success',
    });
  }, [onFinish]);

  return (
    <SafeAreaBox style={styles.pageWrap}>
      <StatusBar barStyle={'light-content'} />
      <CustomHeader themeType={'blue'} backTitle={t('')} leftCallback={goBack} titleDom={t('Details')} />
      <View style={styles.pageContainer}>
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
                <TouchableOpacity
                  style={styles.handleIconItem}
                  onPress={() => copyAddress(addressFormat(address, chainId, 'aelf'))}>
                  <CommonSvg color={defaultColors.font4} icon="copy3" size={pTd(20)} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.handleIconItem} onPress={() => navToExplore(address, chainId)}>
                  <CommonSvg icon="share2" size={pTd(20)} />
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
      </View>
    </SafeAreaBox>
  );
};

export default ContactActivity;

const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg5,
    ...GStyles.paddingArg(0),
    paddingTop: getStatusBarHeight(true),
  },
  pageContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: defaultColors.bg4,
  },
  container: {
    ...GStyles.paddingArg(0, 0),
  },
  itemAvatar: {
    marginRight: pTd(10),
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
    backgroundColor: defaultColors.bg1,
    height: 200,
    width: '100%',
  },
});
