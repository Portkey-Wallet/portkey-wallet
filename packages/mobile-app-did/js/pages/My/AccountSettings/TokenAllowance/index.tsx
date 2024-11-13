import React, { useCallback, useEffect, useState } from 'react';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { FlatList } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import TokenAllowanceItem from './components/TokenAllowanceItem';
import NoData from 'components/NoData';
import Touchable from 'components/Touchable';
import { useFetchTokenAllowanceList } from '@portkey-wallet/hooks/hooks-ca/assets';
import { PAGE_SIZE_DEFAULT } from '@portkey-wallet/constants/constants-ca/assets';
import { ITokenAllowance } from '@portkey-wallet/types/types-ca/allowance';
import { useEffectOnce } from '@portkey-wallet/hooks';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import LottieLoading from 'components/LottieLoading';
import myEvents from 'utils/deviceEvent';
import { makeStyles, useTheme } from '@rneui/themed';

const TokenAllowanceHome: React.FC = () => {
  const { t } = useLanguage();

  const [list, setList] = useState<ITokenAllowance[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const styles = getStyles();
  const theme = useTheme();
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
      titleDom={t('Token Allowances')}
      safeAreaColor={['black', 'black']}
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
                style={{ backgroundColor: theme.theme.colors.bg6 }}
                message={t('No Data')}
                topDistance={pTd(120)}
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

const getStyles = makeStyles(theme => ({
  pageWrap: {
    backgroundColor: theme.colors.bg6,
    ...GStyles.paddingArg(16, 0, 0, 0),
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
  contentContainerStyle: {
    ...GStyles.paddingArg(0),
  },
}));
