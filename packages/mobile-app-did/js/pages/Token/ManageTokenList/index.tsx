import PageContainer from 'components/PageContainer';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import CommonInputNew from 'components/CommonInputNew';
import { StyleSheet, View } from 'react-native';
import gStyles from 'assets/theme/GStyles';
import { darkColors } from 'assets/theme';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CommonToast from 'components/CommonToast';
import { useLanguage } from 'i18n/hooks';
import useDebounce from 'hooks/useDebounce';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { request } from '@portkey-wallet/api/api-did';
import { useCaAddressInfoList, useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Loading from 'components/Loading';
import FilterTokenSection from '../components/FilterToken';
import PopularTokenSection from '../components/PopularToken';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import {
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_IN_ACCOUNT_ASSETS,
  PAGE_SIZE_IN_ACCOUNT_TOKEN,
} from '@portkey-wallet/constants/constants-ca/assets';
import { useTokenLegacy } from '@portkey-wallet/hooks/hooks-ca/useToken';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import { makeStyles } from '@rneui/themed';

interface ManageTokenListProps {
  route?: any;
}
const ManageTokenList: React.FC<ManageTokenListProps> = () => {
  const { t } = useLanguage();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isSearch, setIsSearching] = useState<boolean>(false);
  const { tokenDataShowInMarket, totalRecordCount, fetchTokenInfoList } = useTokenLegacy();
  const chainIdArray = useChainIdList();
  const caAddressInfos = useCaAddressInfoList();

  const { fetchAccountTokenInfoList } = useAccountTokenInfo();

  const [keyword, setKeyword] = useState<string>('');
  const [filterTokenList, setFilterTokenList] = useState<TokenItemShowType[]>([]);

  const debounceWord = useDebounce(keyword, 800);
  const pageStyles = getStyles();

  const getTokenList = useLockCallback(
    async (isInit?: boolean) => {
      if (debounceWord) return;
      if (totalRecordCount && tokenDataShowInMarket.length >= totalRecordCount && !isInit) return;

      await fetchTokenInfoList({
        keyword: '',
        chainIdArray,
        skipCount: isInit ? 0 : tokenDataShowInMarket.length,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
      });
    },
    [chainIdArray, debounceWord, fetchTokenInfoList, tokenDataShowInMarket, totalRecordCount],
  );

  const searchToken = useLockCallback(async () => {
    if (!debounceWord) return;

    try {
      setIsSearching(true);

      const res = await request.token.fetchTokenListBySearch({
        params: {
          symbol: keyword,
          chainIds: chainIdArray,
          version: '1.11.1',
          skipCount: 0,
          maxResultCount: PAGE_SIZE_DEFAULT,
        },
      });
      const _target = (res || []).map((item: any) => ({
        ...item,
        isAdded: item.isDisplay,
        userTokenId: item.id,
      }));
      setFilterTokenList(_target);
    } catch (error) {
      setFilterTokenList([]);
      console.log('filter search error', error);
    } finally {
      setIsSearching(false);
    }
  }, [chainIdArray, debounceWord, keyword]);

  const onSwitchTokenDisplay = useCallback(
    async (item: TokenItemShowType, isDisplay: boolean) => {
      Loading.showOnce();

      try {
        await request.token.displayUserToken({
          resourceUrl: `${item.userTokenId}/display`,
          params: {
            isDisplay,
          },
        });
        timerRef.current = setTimeout(async () => {
          fetchAccountTokenInfoList({
            caAddressInfos,
            skipCount: 0,
            maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
          });

          if (debounceWord) {
            await searchToken();
          } else {
            await getTokenList(true);
          }
          Loading.hide();
          CommonToast.success('Success');
        }, 800);
      } catch (err) {
        Loading.hide();
        CommonToast.failError(err);
      }
    },
    [caAddressInfos, debounceWord, fetchAccountTokenInfoList, getTokenList, searchToken],
  );

  const onHandleToken = useCallback(
    (item: TokenItemShowType, isDisplay: boolean) => {
      onSwitchTokenDisplay(item, isDisplay);
    },
    [onSwitchTokenDisplay],
  );

  // search token with keyword
  useEffect(() => {
    if (!debounceWord) setFilterTokenList([]);
    searchToken();
  }, [debounceWord, searchToken]);

  // get token list
  useEffectOnce(() => {
    getTokenList(true);
  });

  // clear timer
  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const RightDom = useMemo(
    () => (
      <Touchable
        style={pageStyles.rightIconStyle}
        onPress={() => {
          navigationService.navigate('CustomToken');
        }}>
        <Svg icon="add4" size={pTd(24)} />
      </Touchable>
    ),
    [],
  );

  return (
    <PageContainer
      titleDom={t('Manage Token List')}
      safeAreaColor={['black', 'black']}
      rightDom={RightDom}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.inputWrap}>
        <CommonInputNew
          allowClear
          grayBorder
          value={keyword}
          placeholder={t('Search')}
          onChangeText={v => {
            setKeyword(v.trim());
          }}
        />
      </View>

      {debounceWord ? (
        <FilterTokenSection tokenList={filterTokenList} onHandleTokenItem={onHandleToken} isSearch={isSearch} />
      ) : (
        <PopularTokenSection
          tokenDataShowInMarket={tokenDataShowInMarket}
          getTokenList={getTokenList}
          onHandleTokenItem={onHandleToken}
        />
      )}
    </PageContainer>
  );
};

export default ManageTokenList;

export const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    ...gStyles.paddingArg(0),
  },
  inputWrap: {
    backgroundColor: theme.colors.bgBase1,
    ...gStyles.paddingArg(0, 16, 0, 16),
  },
  list: {
    flex: 1,
  },
  loadingIcon: {
    width: pTd(20),
  },
  rightIconStyle: {
    padding: pTd(16),
  },
}));
