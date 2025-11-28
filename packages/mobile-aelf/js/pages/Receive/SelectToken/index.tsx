import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { IUserTokenItemResponse } from '@portkey-wallet/types/types-eoa/token';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-eoa/activity';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { useAppCommonDispatch, useLatestRef } from '@portkey-wallet/hooks';
import useDebounce from 'hooks/useDebounce';
import useEffectOnce from 'hooks/useEffectOnce';
import { useChainIdList } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import NoData from 'components/NoData';
import useToken from '@portkey-wallet/hooks/hooks-eoa/useToken';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { PAGE_SIZE_IN_ACCOUNT_ASSETS } from '@portkey-wallet/constants/constants-eoa/assets';
import myEvents from 'utils/deviceEvent';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import CommonInput from 'components/CommonInput';
import gStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';
import CommonAvatar from 'components/CommonAvatar';
import { TextL } from 'components/CommonText';
import { makeStyles } from '@rneui/themed';
import Svg from 'components/Svg';
import GStyles from 'assets/theme/GStyles';
import { useAccountTokenInfoMixLocalShowToken } from '@portkey-wallet/hooks/hooks-eoa/assets';

const SelectToken = () => {
  console.log('SelectToken!!!!!');
  const { t } = useLanguage();
  const { totalRecordCount, fetchTokenInfoList } = useToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tokenDataShowInMarket = useAccountTokenInfoMixLocalShowToken() ?? [];
  console.log('tokenDataShowInMarket=== is', JSON.stringify(tokenDataShowInMarket));
  const dispatch = useAppCommonDispatch();
  const chainIdList = useChainIdList();
  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 800);
  const [filteredShowList, setFilteredShowList] = useState<IUserTokenItemResponse[]>([]);
  const [isSearch, setIsSearch] = useState(false);
  const styles = getStyles();

  const renderItem = useCallback(
    ({ item }: { item: IUserTokenItemResponse }) => (
      <Touchable
        style={styles.tokenItemWrap}
        onPress={() => {
          navigationService.navigate('Receive', {
            tokenInfo: item,
            chainId: item.symbol === 'ELF' ? MAIN_CHAIN_ID : undefined,
          });
        }}>
        <CommonAvatar
          hasBorder
          shapeType="circular"
          title={item.symbol}
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
    [styles],
  );

  const getTokenList = useLockCallback(
    async (init?: boolean) => {
      if (debounceKeyword.trim()) {
        return;
      }
      if (totalRecordCount && tokenDataShowInMarket?.length >= totalRecordCount && !init) {
        return;
      }

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
    if (!debounceKeyword.trim()) {
      return;
    }
    try {
      setIsSearch(true);
      // const res = await request.token.fetchTokenListBySearchV2({
      //   params: {
      //     symbol: debounceKeyword.trim(),
      //     chainIds: chainIdList,
      //     version: '1.11.1',
      //     skipCount: 0,
      //     maxResultCount: PAGE_SIZE_DEFAULT,
      //   },
      // });
      const upperSearchValue = debounceKeyword.trim().toUpperCase();
      const result = tokenDataShowInMarket.filter(item => item.symbol.toUpperCase().includes(upperSearchValue));
      setFilteredShowList(result);
    } catch (error) {
      setFilteredShowList([]);
      console.log('fetchTokenListByFilter error', error);
    } finally {
      setIsSearch(false);
    }
  }, [debounceKeyword, tokenDataShowInMarket]);

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
      titleDom={t('Select Asset to Receive')}
      safeAreaColor={['black', 'black']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <CommonInput
        allowClear
        clearIcon="clear4"
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
        // eslint-disable-next-line react/no-unstable-nested-components
        ListHeaderComponent={() => {
          return (
            <Touchable
              style={[
                GStyles.flexRow,
                GStyles.itemCenter,
                GStyles.marginArg(8),
                GStyles.paddingArg(16, 12),
                styles.receiveNFTs,
              ]}
              onPress={() => {
                navigationService.navigate('ReceiveNFTs');
              }}>
              <Svg icon="photo" size={pTd(24)} />
              <TextL style={GStyles.marginLeft(12)}>Receive NFTs</TextL>
              <View style={GStyles.flex1} />
              <Svg icon="vector-right" size={pTd(12)} />
            </Touchable>
          );
        }}
        data={debounceKeyword ? filteredShowList : tokenDataShowInMarket}
        renderItem={renderItem}
        ListEmptyComponent={noData}
        keyExtractor={(item: any) => item.symbol || ''}
        onEndReached={() => getTokenListLatest.current()}
      />
    </PageContainer>
  );
};

export default SelectToken;

export const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
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
  receiveNFTs: {
    backgroundColor: theme.colors.bgBase2,
    borderRadius: pTd(8),
  },
}));
