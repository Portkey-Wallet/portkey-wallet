import PageContainer from 'components/PageContainer';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import CommonInput from 'components/CommonInput';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import gStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import CommonToast from 'components/CommonToast';
import { TextL, TextS } from 'components/CommonText';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import CommonSwitch from 'components/CommonSwitch';
import CommonAvatar from 'components/CommonAvatar';
import { useLanguage } from 'i18n/hooks';
import NoData from 'components/NoData';
import { fetchAllTokenListAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import useDebounce from 'hooks/useDebounce';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { request } from '@portkey-wallet/api/api-did';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCaAddresses, useCaAddressInfoList, useChainIdList, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchTokenListAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import Loading from 'components/Loading';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { FontStyles } from 'assets/theme/styles';
import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';
import { NetworkType } from '@portkey-wallet/types';

interface ManageTokenListProps {
  route?: any;
}

type ItemProps = {
  networkType: NetworkType;
  item: TokenItemShowType;
  onHandleToken: (item: TokenItemShowType, type: 'add' | 'delete') => void;
};

const Item = ({ networkType, item, onHandleToken }: ItemProps) => {
  const symbolImages = useSymbolImages();
  return (
    <TouchableOpacity style={itemStyle.wrap} key={`${item.symbol}${item.address}${item.chainId}}`}>
      <CommonAvatar
        hasBorder
        shapeType="circular"
        title={item.symbol}
        svgName={item.symbol === ELF_SYMBOL ? 'elf-icon' : undefined}
        imageUrl={symbolImages[item.symbol]}
        avatarSize={pTd(48)}
        style={itemStyle.left}
      />

      <View style={itemStyle.right}>
        <View>
          <TextL numberOfLines={1} ellipsizeMode={'tail'}>
            {item.symbol}
          </TextL>
          <TextS numberOfLines={1} ellipsizeMode={'tail'} style={[FontStyles.font3]}>
            {`${formatChainInfoToShow(item.chainId, networkType)}`}
          </TextS>
        </View>

        {item.isDefault ? (
          <Svg icon="lock" size={pTd(20)} iconStyle={itemStyle.addedStyle} />
        ) : (
          <TouchableOpacity
            onPress={() => {
              onHandleToken(item, item.isAdded ? 'delete' : 'add');
            }}>
            <View pointerEvents="none">
              <CommonSwitch value={!!item.isAdded} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};
const ManageTokenList: React.FC<ManageTokenListProps> = () => {
  const { t } = useLanguage();

  const currentNetworkInfo = useCurrentNetworkInfo();
  const { currentNetwork } = useWallet();

  const chainList = useChainIdList();

  const dispatch = useAppCommonDispatch();
  const caAddressArray = useCaAddresses();
  const caAddressInfos = useCaAddressInfoList();

  const { tokenDataShowInMarket } = useAppCASelector(state => state.tokenManagement);

  const [keyword, setKeyword] = useState<string>('');

  const debounceWord = useDebounce(keyword, 500);

  useEffect(() => {
    if (tokenDataShowInMarket.length) return;
    dispatch(fetchAllTokenListAsync({ keyword: debounceWord, chainIdArray: chainList }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onHandleTokenItem = useCallback(
    async (item: TokenItemShowType, isAdded: boolean) => {
      // TODO
      Loading.show();
      await request.token
        .displayUserToken({
          baseURL: currentNetworkInfo.apiUrl,
          resourceUrl: `${item.userTokenId}/display`,
          params: {
            isDisplay: isAdded,
          },
        })
        .then(res => {
          console.log(res);
          setTimeout(() => {
            dispatch(fetchAllTokenListAsync({ keyword: debounceWord, chainIdArray: chainList }));
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
    [caAddressArray, caAddressInfos, chainList, currentNetworkInfo.apiUrl, debounceWord, dispatch],
  );

  useEffect(() => {
    dispatch(fetchAllTokenListAsync({ keyword: debounceWord, chainIdArray: chainList }));
  }, [chainList, debounceWord, dispatch]);

  return (
    <PageContainer
      titleDom={t('Add Tokens')}
      safeAreaColor={['blue', 'white']}
      rightDom={<View />}
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
      {!!keyword && !tokenDataShowInMarket.length && <NoData noPic message={t('There is no search result.')} />}
      <FlatList
        style={pageStyles.list}
        data={tokenDataShowInMarket || []}
        renderItem={({ item }: { item: TokenItemShowType }) => (
          <Item
            networkType={currentNetwork}
            item={item}
            onHandleToken={() => onHandleTokenItem(item, !item?.isAdded)}
          />
        )}
        keyExtractor={(item: TokenItemShowType) => item?.id || item?.symbol}
      />
      {/* {isLoading && <Dialog.Loading />} */}
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
  noResult: {
    marginTop: pTd(40),
    textAlign: 'center',
    color: defaultColors.font7,
  },
});

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(72),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    marginLeft: pTd(16),
  },
  right: {
    height: pTd(72),
    marginLeft: pTd(16),
    paddingRight: pTd(16),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  addedStyle: {
    marginRight: pTd(14),
  },
  tokenName: {
    flex: 1,
  },
  balanceWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  token: {
    color: defaultColors.font5,
    lineHeight: pTd(22),
    overflow: 'hidden',
  },
  dollar: {
    marginTop: pTd(2),
    lineHeight: pTd(16),
    color: defaultColors.font7,
  },
});
