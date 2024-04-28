import PageContainer from '@portkey-wallet/rn-components/components/PageContainer';
import CommonInput from '@portkey-wallet/rn-components/components/CommonInput';
import { StyleSheet, View } from 'react-native';
import gStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import React, { useCallback, useState } from 'react';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import { ChainId } from '@portkey-wallet/types';
import FormItem from '@portkey-wallet/rn-components/components/FormItem';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import SelectChain from '@portkey-wallet/rn-components/components/SelectChain';
import CommonButton from '@portkey-wallet/rn-components/components/CommonButton';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { request } from '@portkey-wallet/api/api-did';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import Loading from '@portkey-wallet/rn-components/components/Loading';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import { sleep } from '@portkey-wallet/utils';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import { FontStyles } from '@portkey-wallet/rn-base/assets/theme/styles';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';

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

    setErrorMessage('');
    setBtnDisable(true);
    setTokenItem(pre => ({ ...pre, decimals: '--', symbol: '' }));

    try {
      const res = await request.token.fetchTokenItemBySearch({
        params: {
          symbol: keyword,
          chainId: tokenItem.chainId,
        },
      });
      const { symbol, id } = res || {};

      if (symbol && id) {
        setTokenItem(pre => ({ ...pre, ...res }));
        setKeyword(symbol);
        setBtnDisable(false);
      } else {
        setErrorMessage('Unable to recognize token');
        setBtnDisable(true);
      }
    } catch (err) {
      setBtnDisable(true);
      CommonToast.failError(err);
    } finally {
      Loading.hide();
    }
  }, [keyword, tokenItem.chainId]);

  const fetchTokenItemDebounce = useDebounceCallback(fetchTokenItem, [fetchTokenItem], 800);

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
        CommonToast.success('success');
        await sleep(500);
        navigationService.navigate('ManageTokenList');
      } catch (err: any) {
        CommonToast.failError(err);
        console.log('add custom token error', err);
      } finally {
        Loading.hide();
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
      <FormItem title={'Network'} style={pageStyles.networkWrap}>
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
        <CommonButton onPress={addToken} disabled={btnDisable} type="primary">
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
  networkWrap: {
    paddingBottom: pTd(24),
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
    ...GStyles.paddingArg(20, 16),
  },
  tokenDecimal: {
    lineHeight: pTd(56),
    backgroundColor: defaultColors.bg18,
    color: defaultColors.font7,
    overflow: 'hidden',
    borderRadius: pTd(6),
    paddingLeft: pTd(16),
  },
});
