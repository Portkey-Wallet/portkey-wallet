import PageContainer from 'components/PageContainer';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import CommonInput from 'components/CommonInput';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import gStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CommonToast from 'components/CommonToast';
import { useLanguage } from 'i18n/hooks';
import { fetchAllTokenListAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import useDebounce from 'hooks/useDebounce';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { request } from '@portkey-wallet/api/api-did';
import { useCaAddresses, useCaAddressInfoList, useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchTokenListAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import Loading from 'components/Loading';
import FilterTokenSection from './components/FilterToken';
import PopularTokenSection from './components/PopularToken';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';

interface ManageTokenListProps {
  route?: any;
}
const ManageTokenList: React.FC<ManageTokenListProps> = () => {
  const { t } = useLanguage();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const chainIdList = useChainIdList();

  const dispatch = useAppCommonDispatch();
  const caAddressArray = useCaAddresses();
  const caAddressInfos = useCaAddressInfoList();

  const { tokenDataShowInMarket } = useAppCASelector(state => state.tokenManagement);

  const [keyword, setKeyword] = useState<string>('');
  const [filterTokenList, setFilterTokenList] = useState([]);

  const debounceWord = useDebounce(keyword, 500);

  const onHandleTokenItem = useCallback(
    async (item: TokenItemShowType, isAdded: boolean) => {
      // TODO
      Loading.show();
      await request.token
        .displayUserToken({
          resourceUrl: `${item.userTokenId}/display`,
          params: {
            isDisplay: isAdded,
          },
        })
        .then(res => {
          console.log(res);
          timerRef.current = setTimeout(() => {
            dispatch(fetchAllTokenListAsync({ keyword: debounceWord, chainIdArray: chainIdList }));
            dispatch(fetchTokenListAsync({ caAddresses: caAddressArray, caAddressInfos }));
            Loading.hide();

            CommonToast.success('Success');
          }, 1000);
        })
        .catch(err => {
          console.log(err);
          CommonToast.fail('Fail');
        });
    },
    [caAddressArray, caAddressInfos, chainIdList, debounceWord, dispatch],
  );

  const fetchSearchedTokenList = useCallback(async () => {
    try {
      if (!debounceWord) return;
      const res = await request.token.fetchTokenListBySearch({
        params: {
          symbol: debounceWord,
          chainIds: chainIdList,
        },
      });
      console.log('res', res);
      setFilterTokenList(res?.data || []);
    } catch (error) {
      console.log('filter search error', error);
    }
  }, [chainIdList, debounceWord]);

  useEffect(() => {
    if (tokenDataShowInMarket.length) return;
    dispatch(fetchAllTokenListAsync({ keyword: debounceWord, chainIdArray: chainIdList }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debounceWord) {
      // get filter token
      fetchSearchedTokenList();
    } else {
      dispatch(fetchAllTokenListAsync({ chainIdArray: chainIdList }));
    }
  }, [chainIdList, debounceWord, dispatch, fetchSearchedTokenList]);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  return (
    <PageContainer
      titleDom={t('Add Tokens')}
      safeAreaColor={['blue', 'white']}
      rightDom={
        <TouchableOpacity
          style={{ padding: pTd(16) }}
          onPress={() => {
            navigationService.navigate('CustomToken');
          }}>
          <Svg icon="add1" size={pTd(20)} color={defaultColors.font2} />
        </TouchableOpacity>
      }
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.inputWrap}>
        <CommonInput
          value={keyword}
          placeholder={t('Token Name')}
          onChangeText={v => {
            setKeyword(v.trim());
          }}
        />
      </View>

      {debounceWord ? (
        <FilterTokenSection tokenList={filterTokenList} onHandleTokenItem={onHandleTokenItem} />
      ) : (
        <PopularTokenSection tokenDataShowInMarket={tokenDataShowInMarket} onHandleTokenItem={onHandleTokenItem} />
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
    backgroundColor: defaultColors.bg5,
    ...gStyles.paddingArg(0, 16, 16),
  },
  list: {
    flex: 1,
  },
});
