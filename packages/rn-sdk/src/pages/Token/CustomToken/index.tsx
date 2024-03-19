import PageContainer from 'components/PageContainer';
import CommonInput from 'components/CommonInput';
import { StyleSheet, View } from 'react-native';
import gStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import React, { useCallback, useState } from 'react';
import { TextM } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import CommonButton from 'components/CommonButton';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import { ChainId } from '@portkey/provider-types';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import { sleep } from '@portkey-wallet/utils';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { useUnlockedWallet } from 'model/wallet';
import FormItem from 'components/FormItem';
import SelectChain from 'components/SelectChain';
import { useChainsNetworkInfo, useCurrentNetworkType } from 'model/hooks/network';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { NetworkController } from 'network/controller';
import { getBottomSpace } from 'utils/screen';

interface CustomTokenProps {
  route?: any;
}

const CustomToken: React.FC<CustomTokenProps> = () => {
  const { t } = useLanguage();
  const { onFinish } = useBaseContainer({ entryName: PortkeyEntries.TOKEN_MANAGE_ADD_ENTRY });

  const currentNetwork = useCurrentNetworkType();
  const { originChainId = 'AELF' } = useUnlockedWallet()?.wallet || {};
  const { chainsNetworkInfo: chainList } = useChainsNetworkInfo();

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
    chainId: originChainId as any,
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
      const res = await NetworkController.checkAvailableToken({
        chainId: tokenItem.chainId,
        symbol: keyword,
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
        await NetworkController.setDisplayUserToken({
          resourceUrl: `${tokenItem?.id}/display`,
          isDisplay: true,
        });
        CommonToast.success('success');
        await sleep(500);
        onFinish({ status: 'success' });
      } catch (err: any) {
        CommonToast.failError(err);
        console.log('add custom token error', err);
      } finally {
        Loading.hide();
      }
    }
  }, [onFinish, tokenItem?.id, tokenItem?.isDefault, tokenItem?.isDisplay]);

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
          currentNetwork={currentNetwork === 'MAINNET' ? 'MAINNET' : 'TESTNET'}
          chainId={tokenItem.chainId || originChainId}
          chainList={Object.entries(chainList).map(it => it[1])}
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
    marginBottom: getBottomSpace(),
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
