import PageContainer from 'components/PageContainer';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import CommonInput from 'components/CommonInput';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import gStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CommonToast from 'components/CommonToast';
import { useLanguage } from 'i18n/hooks';
import useDebounce from 'hooks/useDebounce';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { request } from '@portkey-wallet/api/api-did';
import { useCaAddresses, useCaAddressInfoList, useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchTokenListAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import Loading from 'components/Loading';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import FilterTokenSection from '../components/FilterToken';
import Lottie from 'lottie-react-native';
import { handleErrorMessage } from '@portkey-wallet/utils';

interface ManageTokenListProps {
  route?: any;
}
const SearchTokenList: React.FC<ManageTokenListProps> = () => {
  const { t } = useLanguage();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const iptRef = useRef<any>();

  const chainIdList = useChainIdList();

  const dispatch = useAppCommonDispatch();
  const caAddressArray = useCaAddresses();
  const caAddressInfos = useCaAddressInfoList();

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [filterTokenList, setFilterTokenList] = useState<TokenItemShowType[]>([]);

  const debounceWord = useDebounce(keyword, 500);

  const fetchSearchedTokenList = useCallback(async () => {
    try {
      if (!debounceWord) return;
      setIsSearching(true);

      const list = await request.token.fetchTokenListBySearch({
        params: {
          symbol: debounceWord,
          chainIds: chainIdList,
        },
      });

      const tmpToken: TokenItemShowType[] = list.map((item: any) => ({
        ...item,
        isAdded: item.isDisplay,
        userTokenId: item.id,
      }));
      setFilterTokenList(tmpToken);
      setIsSearching(false);
    } catch (error) {
      console.log('filter search error', error);
      Loading.hide();
      setIsSearching(false);
    }
  }, [chainIdList, debounceWord]);

  const onHandleTokenItem = useCallback(
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
          dispatch(fetchTokenListAsync({ caAddresses: caAddressArray, caAddressInfos }));
          await fetchSearchedTokenList();
          Loading.hide();
          CommonToast.success('Success');
        }, 800);
      } catch (err) {
        Loading.hide();
        setIsSearching(false);
        CommonToast.fail(handleErrorMessage(err));
      }
    },
    [caAddressArray, caAddressInfos, dispatch, fetchSearchedTokenList],
  );

  const IptRightIcon = useMemo(() => {
    if (isSearching)
      return (
        <Lottie style={pageStyles.loadingIcon} source={require('assets/lottieFiles/loading.json')} autoPlay loop />
      );

    return keyword ? (
      <TouchableOpacity onPress={() => setKeyword('')}>
        <Svg icon="clear3" size={pTd(16)} />
      </TouchableOpacity>
    ) : undefined;
  }, [isSearching, keyword]);

  const HeaderRightIcon = useMemo(
    () => (
      <TouchableOpacity
        style={{ padding: pTd(16) }}
        onPress={() => {
          navigationService.navigate('CustomToken');
        }}>
        <Svg icon="add1" size={pTd(20)} color={defaultColors.font2} />
      </TouchableOpacity>
    ),
    [],
  );

  useEffect(() => {
    setFilterTokenList([]);
    fetchSearchedTokenList();
  }, [chainIdList, setFilterTokenList, debounceWord, fetchSearchedTokenList]);

  useEffect(() => {
    // input focus
    timerRef.current = setTimeout(() => {
      if (iptRef && iptRef?.current) iptRef.current.focus();
    }, 200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <PageContainer
      titleDom={t('Add Tokens')}
      safeAreaColor={['blue', 'white']}
      rightDom={HeaderRightIcon}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.inputWrap}>
        <CommonInput
          ref={iptRef}
          value={keyword}
          placeholder={t('Token Name')}
          onChangeText={v => {
            setKeyword(v.trim());
          }}
          rightIcon={IptRightIcon}
        />
      </View>
      <FilterTokenSection tokenList={filterTokenList} onHandleTokenItem={onHandleTokenItem} />
    </PageContainer>
  );
};

export default SearchTokenList;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    ...gStyles.paddingArg(0),
  },
  inputWrap: {
    backgroundColor: defaultColors.bg5,
    ...gStyles.paddingArg(8, 20),
  },
  list: {
    flex: 1,
  },
  loadingIcon: {
    width: pTd(20),
  },
});
