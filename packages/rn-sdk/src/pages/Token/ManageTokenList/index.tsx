import PageContainer from 'components/PageContainer';
import CommonInput from '@portkey-wallet/rn-components/components/CommonInput';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import gStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import { useLanguage } from 'i18n/hooks';
import useDebounce from 'hooks/useDebounce';
import Loading from '@portkey-wallet/rn-components/components/Loading';
import FilterTokenSection from '../components/FilterToken';
import PopularTokenSection from '../components/PopularToken';
import { pTd } from 'utils/unit';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import { TokenItemShowType } from '@portkey-wallet/types/types-eoa/token';
import { useChainsNetworkInfo } from 'model/hooks/network';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import { NetworkController } from 'network/controller';
import { useSearchTokenList } from 'model/hooks/balance';

interface ManageTokenListProps {
  route?: any;
  containerId: any;
}
const ManageTokenList: React.FC<ManageTokenListProps> = ({ containerId }: ManageTokenListProps) => {
  const { t } = useLanguage();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { chainsNetworkInfo } = useChainsNetworkInfo();
  const chainIdList = useMemo(() => {
    return Object.entries(chainsNetworkInfo).map(([chainId]) => chainId);
  }, [chainsNetworkInfo]);

  const [keyword, setKeyword] = useState<string>('');
  const [filterTokenList, setFilterTokenList] = useState<TokenItemShowType[]>([]);

  const debounceWord = useDebounce(keyword, 800);

  const { tokenList = [], updateTokensList } = useSearchTokenList();
  const tokenDataShowInMarket = useMemo(() => {
    return tokenList.map(it => {
      return {
        ...it,
        ...it.token,
        id: it.id,
        isAdded: it.isDisplay,
      };
    });
  }, [tokenList]);

  const fetchSearchedTokenList = useCallback(async () => {
    try {
      if (!debounceWord) return;
      setIsSearching(true);

      const { items } = await NetworkController.searchTokenList({
        keyword: debounceWord,
        chainIdArray: chainIdList,
      });

      const tmpToken: TokenItemShowType[] = items.map((item: any) => ({
        ...item,
        ...item.token,
        isAdded: item.isDisplay,
        id: item.id,
      }));
      setFilterTokenList(tmpToken);
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      setIsSearching(false);
    }
  }, [chainIdList, debounceWord]);

  const onRefresh = useCallback(async () => {
    Loading.show({ duration: 2500 });
    if (debounceWord) {
      await fetchSearchedTokenList();
    } else {
      await updateTokensList({ keyword: '', chainIdArray: chainIdList });
    }
    Loading.hide();
  }, [chainIdList, debounceWord, fetchSearchedTokenList, updateTokensList]);

  const { navigateTo } = useBaseContainer({
    entryName: PortkeyEntries.TOKEN_MANAGE_LIST_ENTRY,
    onShow: onRefresh,
    containerId,
  });

  const onHandleTokenItem = useCallback(
    async (item: TokenItemShowType, isDisplay: boolean) => {
      Loading.showOnce();

      try {
        await NetworkController.setDisplayUserToken({
          resourceUrl: `${item.id}/display`,
          isDisplay,
        });
        timerRef.current = setTimeout(async () => {
          if (debounceWord) {
            await fetchSearchedTokenList();
          } else {
            updateTokensList({ keyword: '', chainIdArray: chainIdList });
          }
          Loading.hide();
          CommonToast.success('Success');
        }, 800);
      } catch (err) {
        Loading.hide();
        CommonToast.failError(err);
      }
    },
    [chainIdList, debounceWord, fetchSearchedTokenList, updateTokensList],
  );

  useEffect(() => {
    if (debounceWord) {
      // get filter token
      setFilterTokenList([]);
      fetchSearchedTokenList();
    } else {
      updateTokensList({ chainIdArray: chainIdList });
    }
  }, [chainIdList, debounceWord, fetchSearchedTokenList, updateTokensList]);

  // clear timer
  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const RightDom = useMemo(
    () => (
      <TouchableOpacity
        style={pageStyles.rightIconStyle}
        onPress={() => {
          navigateTo(PortkeyEntries.TOKEN_MANAGE_ADD_ENTRY);
        }}>
        <Svg icon="add1" size={pTd(20)} color={defaultColors.font2} />
      </TouchableOpacity>
    ),
    [navigateTo],
  );

  return (
    <PageContainer
      titleDom={t('Add Tokens')}
      safeAreaColor={['blue', 'white']}
      rightDom={RightDom}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.inputWrap}>
        <CommonInput
          allowClear
          loading={isSearching}
          value={keyword}
          placeholder={t('Token Name')}
          onChangeText={v => {
            setKeyword(v.trim());
          }}
          t={t}
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
    ...gStyles.paddingArg(8, 20, 8),
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
