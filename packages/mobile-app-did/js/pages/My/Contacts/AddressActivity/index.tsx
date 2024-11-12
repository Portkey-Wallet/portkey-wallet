import { ChainId } from '@portkey-wallet/types';
import { sleep } from '@portkey-wallet/utils';
import { useRoute, RouteProp } from '@react-navigation/native';
// import Svg from 'components/Svg';
import React, { useCallback, useMemo, useRef, useState } from 'react';
// import { View, StyleSheet } from 'react-native';
import navigationService from 'utils/navigationService';
// import { pTd } from 'utils/unit';
import NoData from 'components/NoData';
// import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { NFT_MIDDLE_SIZE } from '@portkey-wallet/constants/constants-ca/assets';
import { request } from '@portkey-wallet/api/api-did';
import { IActivityListWithAddressApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import ActivityItem from 'components/ActivityItem';
import { showActivityDetail } from 'components/ActivityOverlay';
import { ListLoadingEnum } from 'constants/misc';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { FlatListFooterLoading } from 'components/FlatListFooterLoading';
import { FlashList } from '@shopify/flash-list';
import { pTd } from 'utils/unit';

interface IAddressActivityProps {
  address: string;
  chainId: ChainId;
}

const MAX_RESULT_COUNT = 20;

const AddressActivity: React.FC<IAddressActivityProps> = props => {
  const { address, chainId } = props;
  const caAddressInfos = useCaAddressInfoList();

  const [totalCount, setTotalCount] = useState(0);
  const [activityList, setActivityList] = useState<ActivityItemType[]>([]);
  const activityListRef = useRef(activityList);
  activityListRef.current = activityList;
  const isFetching = useRef(false);

  const params: IActivityListWithAddressApiParams = useMemo(
    () => ({
      maxResultCount: MAX_RESULT_COUNT,
      skipCount: activityList.length,
      // portkey address
      caAddressInfos: caAddressInfos.filter(ele => ele.chainId === chainId),
      // contact address
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
    [activityList.length, address, caAddressInfos, chainId],
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

  const renderItem = useCallback(({ item, index }: { item: ActivityItemType; index: number }) => {
    const preItem = activityListRef.current?.[index - 1];
    return <ActivityItem preItem={preItem} item={item} index={index} onPress={() => showActivityDetail(item)} />;
  }, []);

  const isInitRef = useRef(false);
  const init = useCallback(async () => {
    await sleep(250);
    await fetchActivityList(0);
    isInitRef.current = true;
  }, [fetchActivityList]);

  const isEmpty = useMemo(() => activityList.length === 0, [activityList.length]);

  return (
    <FlashList
      refreshing={isLoading === ListLoadingEnum.header}
      data={activityList ?? []}
      keyExtractor={(_item, index) => `${index}`}
      ListEmptyComponent={<NoData noPic message="" />}
      renderItem={renderItem}
      onRefresh={() => init()}
      onEndReached={() => {
        console.log('onEndReached', isInitRef.current, activityList?.length, totalCount);
        if (!isInitRef.current || isLoading !== ListLoadingEnum.hide) return;
        if (activityList?.length >= totalCount) return;

        fetchActivityList(activityList?.length);
      }}
      // onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
      onEndReachedThreshold={0}
      ListFooterComponent={
        <>{!isEmpty && <FlatListFooterLoading refreshing={isLoading === ListLoadingEnum.footer} />}</>
      }
      onLoad={() => {
        if (isInitRef.current) return;
        init();
      }}
      style={{
        height: pTd(900),
      }}
    />
  );
};

export default AddressActivity;

// const styles = StyleSheet.create({
//   container: {
//     ...GStyles.paddingArg(0, 0),
//   },
//   itemAvatar: {
//     marginRight: pTd(10),
//   },
//   topSection: {
//     ...GStyles.paddingArg(24, 20),
//     backgroundColor: defaultColors.bg4,
//   },
//   nameSection: {
//     marginTop: pTd(8),
//     marginBottom: pTd(16),
//     ...GStyles.paddingArg(10, 16),
//     alignItems: 'center',
//     borderRadius: pTd(6),
//   },
//   addressSection: {
//     marginTop: pTd(8),
//     ...GStyles.paddingArg(16),
//     borderRadius: pTd(6),
//   },
//   addressStr: {
//     lineHeight: pTd(20),
//   },
//   chainInfo: {
//     marginTop: pTd(8),
//     color: defaultColors.font3,
//   },
//   handleWrap: {
//     marginTop: pTd(16),
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   handleIconItem: {
//     marginLeft: pTd(40),
//   },
// });
