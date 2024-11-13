import { ChainId } from '@portkey-wallet/types';
import { sleep } from '@portkey-wallet/utils';
import fonts from 'assets/theme/fonts';
import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import { View } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { TextL, TextXXL } from 'components/CommonText';
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
  const styles = getStyles();

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

  const [isLoading, setIsLoading] = useState(ListLoadingEnum.header);
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

  const renderItem = useCallback(
    ({ item, index }: { item: ActivityItemType; index: number }) => {
      const preItem = activityListRef.current?.[index - 1];
      return (
        <ActivityItem
          preItem={preItem}
          item={item}
          index={index}
          onPress={() => showActivityDetail(item)}
          style={styles.itemWrap}
        />
      );
    },
    [styles],
  );

  const isInitRef = useRef(false);
  const init = useCallback(async () => {
    await sleep(250);
    await fetchActivityList(0);
    isInitRef.current = true;
  }, [fetchActivityList]);

  const isEmpty = useMemo(() => activityList.length === 0, [activityList.length]);

  const isRefreshing = useMemo(
    () => isLoading === ListLoadingEnum.header || isLoading === ListLoadingEnum.footer,
    [isLoading],
  );

  return (
    <View style={styles.container}>
      <FlashList
        refreshing={isRefreshing}
        data={activityList ?? []}
        keyExtractor={(_item, index) => `${index}`}
        ListEmptyComponent={isRefreshing ? null : <TextL style={styles.emptyText}>No recent interactions</TextL>}
        renderItem={renderItem}
        onRefresh={() => init()}
        estimatedItemSize={74}
        onEndReached={() => {
          if (!isInitRef.current) return;
          if (activityList?.length >= totalCount) return;

          fetchActivityList(activityList?.length);
        }}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListFooterComponent={
          <>{!isEmpty && <FlatListFooterLoading refreshing={isLoading === ListLoadingEnum.footer} />}</>
        }
        ListHeaderComponent={
          isLoading === ListLoadingEnum.header || isEmpty ? null : (
            <TextXXL style={styles.headerText}>Recent interactions</TextXXL>
          )
        }
        onLoad={() => {
          if (isInitRef.current) return;
          init();
        }}
      />
    </View>
  );
};

export default AddressActivity;

const getStyles = makeStyles(theme => ({
  container: {
    flex: 1,
  },
  itemWrap: {
    marginHorizontal: 0,
  },
  headerText: {
    paddingTop: pTd(32),
    ...fonts.BGMediumFont,
  },
  emptyText: {
    color: theme.colors.textBase2,
    paddingTop: pTd(32),
    textAlign: 'center',
  },
}));
