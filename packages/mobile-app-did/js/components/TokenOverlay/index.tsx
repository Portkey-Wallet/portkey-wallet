import React, { useState, useCallback, useEffect, useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { FlatList, StyleSheet } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import CommonInput from 'components/CommonInput';
import { TokenItemShowType } from '@portkey-wallet/types/types-eoa/token';
import { AccountType } from '@portkey-wallet/types/wallet';
import TokenListItem from 'components/TokenListItem';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { useAppCommonDispatch, useLatestRef } from '@portkey-wallet/hooks';
import useDebounce from 'hooks/useDebounce';
import useEffectOnce from 'hooks/useEffectOnce';
import { useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchAllTokenList } from '@portkey-wallet/store/store-ca/tokenManagement/api';
import NoData from 'components/NoData';
import { useGStyles } from 'assets/theme/useGStyles';
import myEvents from '../../utils/deviceEvent';
import { ChainId } from '@portkey-wallet/types';
import useToken from '@portkey-wallet/hooks/hooks-ca/useToken';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_IN_ACCOUNT_ASSETS } from '@portkey-wallet/constants/constants-ca/assets';

type onFinishSelectTokenType = (tokenItem: TokenItemShowType) => void;
type TokenListProps = {
  title?: string;
  currentSymbol?: string;
  currentChainId?: ChainId;
  account?: AccountType;
  onFinishSelectToken?: onFinishSelectTokenType;
};

const TokenList = ({ title = 'Select Token', onFinishSelectToken, currentSymbol, currentChainId }: TokenListProps) => {
  const { t } = useLanguage();
  const { tokenDataShowInMarket, totalRecordCount, fetchTokenInfoList } = useToken();

  const dispatch = useAppCommonDispatch();
  const chainIdList = useChainIdList();
  const gStyles = useGStyles();

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 800);

  const [filteredShowList, setFilteredShowList] = useState<any[]>([]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TokenListItem
        noBalanceShow
        key={`${item.symbol}${item.chainId}`}
        item={item}
        currentSymbol={currentSymbol}
        currentChainId={currentChainId}
        onPress={() => {
          OverlayModal.hide();
          onFinishSelectToken?.(item);
        }}
      />
    ),
    [currentChainId, currentSymbol, onFinishSelectToken],
  );

  const getTokenList = useLockCallback(
    async (init?: boolean) => {
      if (keyword) return;
      if (totalRecordCount && tokenDataShowInMarket?.length >= totalRecordCount && !init) return;

      await fetchTokenInfoList({
        keyword: '',
        chainIdArray: chainIdList,
        skipCount: init ? 0 : tokenDataShowInMarket?.length,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
      });
    },
    [chainIdList, fetchTokenInfoList, keyword, tokenDataShowInMarket, totalRecordCount],
  );
  const getTokenListLatest = useLatestRef(getTokenList);

  const getTokenListWithKeyword = useLockCallback(async () => {
    if (!debounceKeyword) return;
    try {
      const result = await fetchAllTokenList({
        keyword: debounceKeyword,
        chainIdArray: chainIdList,
        skipCount: 0,
        maxResultCount: PAGE_SIZE_DEFAULT,
      });

      setFilteredShowList(result?.items?.map(item => item.token));
    } catch (error) {
      console.log('fetchTokenListByFilter error', error);
    }
  }, [chainIdList, debounceKeyword]);

  useEffect(() => {
    getTokenListWithKeyword();
  }, [chainIdList, debounceKeyword, dispatch, getTokenListWithKeyword]);

  useEffectOnce(() => {
    getTokenListLatest.current(true);
  });

  const noData = useMemo(() => {
    return debounceKeyword ? <NoData noPic message={t('There is no search result.')} /> : null;
  }, [debounceKeyword, t]);

  return (
    <ModalBody modalBodyType="bottom" title={title} style={gStyles.overlayStyle}>
      <CommonInput
        placeholder={t('Token Name')}
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
    </ModalBody>
  );
};

export const showTokenList = (props: TokenListProps) => {
  OverlayModal.show(<TokenList {...props} />, {
    position: 'bottom',
    enabledNestScrollView: true,
  });
};

export default {
  showTokenList,
};

export const styles = StyleSheet.create({
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
    marginLeft: pTd(16),
    width: pTd(343),
    marginBottom: pTd(8),
  },
  inputContainerStyle: {
    height: pTd(44),
  },
  inputStyle: {
    height: pTd(44),
  },
  flatList: {
    marginTop: pTd(8),
  },
});
