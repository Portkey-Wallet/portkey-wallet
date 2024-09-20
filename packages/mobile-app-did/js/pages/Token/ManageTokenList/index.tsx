import PageContainer from 'components/PageContainer';
import { IUserTokenItemResponse, TokenItemShowType, IUserTokenItem } from '@portkey-wallet/types/types-ca/token';
import CommonInput from 'components/CommonInput';
import { StyleSheet, View } from 'react-native';
import gStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
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
import { showManageToken } from '../components/ManageToken';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import {
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_IN_ACCOUNT_ASSETS,
  PAGE_SIZE_IN_ACCOUNT_TOKEN,
} from '@portkey-wallet/constants/constants-ca/assets';
import useToken from '@portkey-wallet/hooks/hooks-ca/useToken';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';

interface ManageTokenListProps {
  route?: any;
}
const ManageTokenList: React.FC<ManageTokenListProps> = () => {
  const { t } = useLanguage();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { tokenDataShowInMarket, totalRecordCount, fetchTokenInfoList } = useToken();
  const chainIdArray = useChainIdList();
  const caAddressInfos = useCaAddressInfoList();

  const { fetchAccountTokenInfoList } = useAccountTokenInfo();

  const [keyword, setKeyword] = useState<string>('');
  const [filterTokenList, setFilterTokenList] = useState<TokenItemShowType[]>([]);

  const debounceWord = useDebounce(keyword, 800);

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

      const res = await request.token.fetchTokenListBySearchV2({
        params: {
          symbol: keyword,
          chainIds: chainIdArray,
          version: '1.11.1',
          skipCount: 0,
          maxResultCount: PAGE_SIZE_DEFAULT,
        },
      });
      const _target = (res.data || []).map((item: any) => ({
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
    async (ids: string[], isDisplay: boolean) => {
      Loading.showOnce();

      try {
        await request.token.userTokensDisplaySwitch({
          params: {
            isDisplay: !isDisplay,
            ids,
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
    (item: IUserTokenItemResponse, isDisplay: boolean) => {
      onSwitchTokenDisplay(item.tokens?.map((token: any) => token.id) ?? [], isDisplay);
    },
    [onSwitchTokenDisplay],
  );

  const onHandleTokenItem = useCallback(
    (item: IUserTokenItem, isDisplay: boolean) => {
      item.id && onSwitchTokenDisplay([item.id], isDisplay);
    },
    [onSwitchTokenDisplay],
  );

  const onEditToken = useCallback(
    (item: IUserTokenItemResponse) => {
      showManageToken({ item, onHandleTokenItem });
    },
    [onHandleTokenItem],
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
        <Svg icon="add1" size={pTd(20)} color={defaultColors.font18} />
      </Touchable>
    ),
    [],
  );

  return (
    <PageContainer
      titleDom={t('Add Tokens')}
      safeAreaColor={['white', 'white']}
      rightDom={RightDom}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.inputWrap}>
        <CommonInput
          allowClear
          grayBorder
          theme="white-bg"
          loading={isSearching}
          value={keyword}
          placeholder={t('Token Name')}
          onChangeText={v => {
            setKeyword(v.trim());
          }}
        />
      </View>

      {debounceWord ? (
        <FilterTokenSection tokenList={filterTokenList} onHandleTokenItem={onHandleToken} onEditToken={onEditToken} />
      ) : (
        <PopularTokenSection
          tokenDataShowInMarket={tokenDataShowInMarket}
          getTokenList={getTokenList}
          onHandleTokenItem={onHandleToken}
          onEditToken={onEditToken}
        />
      )}
    </PageContainer>
  );
};

export default ManageTokenList;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    ...gStyles.paddingArg(0),
  },
  inputWrap: {
    backgroundColor: defaultColors.bg1,
    ...gStyles.paddingArg(0, 20, 8),
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
});
