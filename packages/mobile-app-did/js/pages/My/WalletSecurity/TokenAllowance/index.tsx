import React, { useCallback, useEffect, useState } from 'react';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { FlatList, StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import TokenAllowanceItem from './components/TokenAllowanceItem';
import NoData from 'components/NoData';
import Touchable from 'components/Touchable';
import { useFetchTokenAllowanceList } from '@portkey-wallet/hooks/hooks-ca/assets';
import { PAGE_SIZE_DEFAULT } from '@portkey-wallet/constants/constants-ca/assets';
import { ITokenAllowance } from '@portkey-wallet/types/types-ca/allowance';
import { useEffectOnce } from '@portkey-wallet/hooks';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { BGStyles } from 'assets/theme/styles';
import LottieLoading from 'components/LottieLoading';
import myEvents from 'utils/deviceEvent';

const TokenAllowanceHome: React.FC = () => {
  const { t } = useLanguage();

  const [list, setList] = useState<ITokenAllowance[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const fetchTokenAllowanceList = useFetchTokenAllowanceList();

  const fetchList = useLockCallback(
    async (init?: boolean) => {
      try {
        setIsFetching(true);
        const res = await fetchTokenAllowanceList({
          skipCount: init ? 0 : list.length,
          maxResultCount: PAGE_SIZE_DEFAULT,
        });
        setTotalCount(res.totalRecordCount);
        if (init) {
          setList(res.data);
        } else {
          setList(pre => [...pre, ...res.data]);
        }
      } catch (error) {
        console.log('===fetchTokenAllowanceList error', error);
      } finally {
        setIsFetching(false);
      }
    },
    [fetchTokenAllowanceList, list.length],
  );

  const onEndReached = useCallback(() => {
    if (totalCount <= list.length) return;
    if (isFetching) return;
    fetchList(false);
  }, [fetchList, isFetching, list.length, totalCount]);

  useEffectOnce(() => {
    fetchList(true);
  });
  useEffect(() => {
    const listener = myEvents.refreshAllowanceList.addListener(() => {
      fetchList(true);
    });
    return () => {
      listener.remove();
    };
  }, [fetchList]);

  return (
    <PageContainer
      leftCallback={() => navigationService.navigate('Tab')}
      titleDom={t('Token Allowance')}
      safeAreaColor={['blue', 'gray']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <FlatList
        nestedScrollEnabled
        contentContainerStyle={styles.contentContainerStyle}
        data={list || []}
        ListEmptyComponent={() =>
          isFetching ? (
            <LottieLoading />
          ) : (
            <Touchable>
              <NoData
                style={BGStyles.bg4}
                message={t('No Data')}
                topDistance={pTd(40)}
                oblongSize={[pTd(64), pTd(64)]}
              />
            </Touchable>
          )
        }
        renderItem={({ item }) => (
          <TokenAllowanceItem
            item={item}
            onPress={() => {
              navigationService.navigate('TokenAllowanceDetail', { item });
            }}
          />
        )}
        keyExtractor={item => item?.contractAddress}
        onEndReached={onEndReached}
      />
    </PageContainer>
  );
};

export default TokenAllowanceHome;

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(0),
  },

  contactListStyle: {
    backgroundColor: defaultColors.bg1,
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
  contentContainerStyle: {
    ...GStyles.paddingArg(24, 20, 18),
  },
});
