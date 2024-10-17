import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { IUserTokenItemResponse } from '@portkey-wallet/types/types-ca/token';
import { darkColors, defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { useAppCommonDispatch, useLatestRef } from '@portkey-wallet/hooks';
import useDebounce from 'hooks/useDebounce';
import useEffectOnce from 'hooks/useEffectOnce';
import { useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import NoData from 'components/NoData';
import useToken from '@portkey-wallet/hooks/hooks-ca/useToken';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_IN_ACCOUNT_ASSETS } from '@portkey-wallet/constants/constants-ca/assets';
import myEvents from 'utils/deviceEvent';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import CommonInputNew from 'components/CommonInputNew';
import gStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';
import CommonAvatar from 'components/CommonAvatar';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { request } from '@portkey-wallet/api/api-did';
import { TextL } from 'components/CommonText';

const SelectToken = () => {
  const { t } = useLanguage();
  const { tokenDataShowInMarket = [], totalRecordCount, fetchTokenInfoList } = useToken();
  const dispatch = useAppCommonDispatch();
  const chainIdList = useChainIdList();
  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 800);
  const [filteredShowList, setFilteredShowList] = useState<IUserTokenItemResponse[]>([]);
  const defaultToken = useDefaultToken();
  const [isSearch, setIsSearch] = useState(false);

  const renderItem = useCallback(
    ({ item }: { item: IUserTokenItemResponse }) => (
      <Touchable
        style={styles.tokenItemWrap}
        onPress={() => {
          navigationService.navigate('Receive', item);
        }}>
        <CommonAvatar
          hasBorder
          shapeType="circular"
          title={item.symbol}
          svgName={item.symbol === defaultToken.symbol ? 'testnet' : undefined}
          imageUrl={item.imageUrl}
          avatarSize={pTd(42)}
          style={styles.leftIcon}
          borderStyle={gStyles.hairlineBorder}
        />
        <TextL numberOfLines={1} ellipsizeMode={'tail'} style={{ lineHeight: pTd(22) }}>
          {item.label || item.symbol}
        </TextL>
      </Touchable>
    ),
    [defaultToken.symbol],
  );

  const getTokenList = useLockCallback(
    async (init?: boolean) => {
      if (debounceKeyword.trim()) return;
      if (totalRecordCount && tokenDataShowInMarket?.length >= totalRecordCount && !init) return;

      await fetchTokenInfoList({
        keyword: '',
        chainIdArray: chainIdList,
        skipCount: init ? 0 : tokenDataShowInMarket?.length,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
      });
    },
    [chainIdList, debounceKeyword, fetchTokenInfoList, tokenDataShowInMarket?.length, totalRecordCount],
  );
  const getTokenListLatest = useLatestRef(getTokenList);

  const getTokenListWithKeyword = useLockCallback(async () => {
    if (!debounceKeyword.trim()) return;
    try {
      setIsSearch(true);
      const res = await request.token.fetchTokenListBySearchV2({
        params: {
          symbol: debounceKeyword.trim(),
          chainIds: chainIdList,
          version: '1.11.1',
          skipCount: 0,
          maxResultCount: PAGE_SIZE_DEFAULT,
        },
      });
      setFilteredShowList(res?.data);
    } catch (error) {
      setFilteredShowList([]);
      console.log('fetchTokenListByFilter error', error);
    } finally {
      setIsSearch(false);
    }
  }, [chainIdList, debounceKeyword]);

  useEffect(() => {
    if (debounceKeyword.trim()) {
      getTokenListWithKeyword();
    } else {
      setFilteredShowList([]);
    }
  }, [chainIdList, debounceKeyword, dispatch, getTokenListWithKeyword]);

  useEffectOnce(() => {
    getTokenListLatest.current(true);
  });

  const noData = useMemo(() => {
    return debounceKeyword && !isSearch ? <NoData noPic message={t('There is no search result.')} /> : null;
  }, [debounceKeyword, isSearch, t]);

  return (
    <PageContainer
      titleDom={t(`Select Asset to Receive`)}
      safeAreaColor={['black', 'black']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <CommonInputNew
        allowClear
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        value={keyword}
        onChangeText={v => {
          setKeyword(v.trim());
        }}
      />
      <FlatList
        onLayout={e => {
          myEvents.nestScrollViewLayout.emit(e.nativeEvent.layout);
        }}
        disableScrollViewPanResponder={true}
        style={styles.flatList}
        onScroll={({ nativeEvent }) => {
          const {
            contentOffset: { y: scrollY },
          } = nativeEvent;
          if (scrollY <= 0) {
            myEvents.nestScrollViewScrolledTop.emit();
          }
        }}
        data={debounceKeyword ? filteredShowList : tokenDataShowInMarket}
        renderItem={renderItem}
        ListEmptyComponent={noData}
        keyExtractor={(item: any) => item.id || ''}
        onEndReached={() => getTokenListLatest.current()}
      />
    </PageContainer>
  );
};

export default SelectToken;

export const styles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: darkColors.bgBase1,
    ...gStyles.paddingArg(0),
  },
  title: {
    textAlign: 'center',
    color: defaultColors.font5,
    height: pTd(22),
    lineHeight: pTd(22),
    marginTop: pTd(17),
    marginBottom: pTd(16),
    ...fonts.mediumFont,
  },
  containerStyle: {
    height: pTd(52),
    ...gStyles.paddingArg(0, 16, 12, 16),
  },
  inputContainerStyle: {
    height: pTd(40),
  },
  inputStyle: {
    height: pTd(44),
  },
  flatList: {
    marginTop: pTd(8),
  },
  tokenItemWrap: {
    height: pTd(74),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...gStyles.paddingArg(16),
  },
  leftIcon: {
    marginRight: pTd(8),
  },
});
