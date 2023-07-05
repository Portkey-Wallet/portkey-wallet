import PageContainer from 'components/PageContainer';
import CommonInput from 'components/CommonInput';
import { StyleSheet, View } from 'react-native';
import gStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import React, { useCallback, useState } from 'react';
import { TextM } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ChainId } from '@portkey-wallet/types';
import FormItem from 'components/FormItem';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import SelectChain from 'components/SelectChain';
import CommonButton from 'components/CommonButton';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { request } from '@portkey-wallet/api/api-did';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import Loading from 'components/Loading';
import navigationService from 'utils/navigationService';
import { sleep } from '@portkey-wallet/utils';
import CommonToast from 'components/CommonToast';
import { FontStyles } from 'assets/theme/styles';

interface CustomTokenProps {
  route?: any;
}

const CustomToken: React.FC<CustomTokenProps> = () => {
  const { t } = useLanguage();

  const originChainId = useOriginChainId();
  const { chainList = [], currentNetwork } = useCurrentWallet();

  const [keyword, setKeyword] = useState<string>('');
  const [tokenItem, setTokenItem] = useState<{
    symbol: string;
    chainId: ChainId;
    decimals: string;
    id: string;
    isDefault?: boolean;
    isDisplay?: boolean;
  }>({
    symbol: '',
    chainId: originChainId,
    decimals: '--',
    id: '',
  });
  const [btnDisable, setBtnDisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchTokenItem = useCallback(async () => {
    if (!keyword) return;

    Loading.show();
    setBtnDisable(true);
    setTokenItem(pre => ({ ...pre, decimals: '--', symbol: '' }));

    try {
      const res = await request.token.fetchTokenItemBySearch({
        params: {
          symbol: keyword,
          chainId: tokenItem.chainId,
        },
      });
      const { symbol, decimals, id } = res;

      if (symbol && decimals && id) {
        setTokenItem(pre => ({ ...pre, ...res }));
        setKeyword(symbol);
        setBtnDisable(false);
      }
    } catch (error) {
      setBtnDisable(true);
    } finally {
      Loading.hide();
    }
  }, [keyword, tokenItem.chainId]);

  const fetchTokenItemDebounce = useDebounceCallback(fetchTokenItem, [tokenItem], 800);

  const onKeywordChange = useCallback(
    (v: string) => {
      setKeyword(v.trim());
      fetchTokenItemDebounce();
    },
    [fetchTokenItemDebounce],
  );

  const onChainChange = useCallback(
    (_chainId: ChainId) => {
      setBtnDisable(true);
      setTokenItem(pre => ({ ...pre, chainId: _chainId }));
      fetchTokenItemDebounce();
    },
    [fetchTokenItemDebounce],
  );

  const addToken = useCallback(async () => {
    if (tokenItem?.isDefault || tokenItem?.isDisplay) {
      setErrorMessage('This token has already been added.');
    } else {
      try {
        Loading.show();
        await request.token.displayUserToken({
          resourceUrl: `${tokenItem?.id}/display`,
          params: {
            isDisplay: true,
          },
        });
        Loading.hide();
        CommonToast.success('success');
        await sleep(500);
        navigationService.goBack();
      } catch (error: any) {
        console.log('add custom token error', error);
      }
    }
  }, [tokenItem]);

  return (
    <PageContainer
      titleDom={t('Custom Token')}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <TextM style={pageStyles.tips}>
        {t(
          'To add a token, you need to select the network that it belongs to and enter its symbol for automatic recognition.',
        )}
      </TextM>
      <FormItem title={'Network'}>
        <SelectChain
          currentNetwork={currentNetwork}
          chainId={tokenItem.chainId || originChainId}
          chainList={chainList}
          onChainPress={onChainChange}
        />
      </FormItem>
      <FormItem title={'Token Symbol'}>
        <CommonInput
          type="general"
          spellCheck={false}
          autoCorrect={false}
          value={keyword}
          theme={'white-bg'}
          placeholder={t('Enter Symbol')}
          onChangeText={onKeywordChange}
          errorMessage={errorMessage}
        />
      </FormItem>
      <FormItem title={'Token Decimal'}>
        <TextM style={[pageStyles.tokenDecimal, tokenItem.decimals !== '--' && FontStyles.font5]}>
          {tokenItem.decimals}
        </TextM>
      </FormItem>

      <View style={pageStyles.btnContainer}>
        <CommonButton onPress={addToken} disabled={btnDisable} type="solid">
          {t('Add')}
        </CommonButton>
      </View>
    </PageContainer>
  );
};

export default CustomToken;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...gStyles.paddingArg(24, 20),
  },
  tips: {
    color: defaultColors.font3,
    marginBottom: pTd(24),
  },
  list: {
    flex: 1,
  },
  noResult: {
    marginTop: pTd(40),
    textAlign: 'center',
    color: defaultColors.font7,
  },
  btnContainer: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
  },
  tokenDecimal: {
    lineHeight: pTd(56),
    backgroundColor: defaultColors.bg7,
    opacity: 0.3,
    overflow: 'hidden',
    borderRadius: pTd(6),
    paddingLeft: pTd(16),
  },
});
