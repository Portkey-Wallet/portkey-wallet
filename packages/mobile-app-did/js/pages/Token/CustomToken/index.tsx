import PageContainer from 'components/PageContainer';
import CommonInput from 'components/CommonInput';
import { StyleSheet, View } from 'react-native';
import gStyles from 'assets/theme/GStyles';
import { darkColors, defaultColors } from 'assets/theme';
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
import GStyles from 'assets/theme/GStyles';
import { RichText } from 'components/RichText';
import Svg from 'components/Svg';
import { style } from 'components/Dialog/style';

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
      titleDom={t('Import Token')}
      safeAreaColor={['black', 'black']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.tipsSection}>
        <Svg icon="warning" size={pTd(18)} iconStyle={GStyles.marginRight(pTd(12))} />
        <RichText
          wrapperStyle={pageStyles.richTextWrap}
          text={`Anyone can create a token, including fake versions of existing tokens. Learn more about $scams and security risks$.`}
          commonTextStyle={pageStyles.richTextCommonStyle}
          specialTextStyle={pageStyles.richTextSpecialStyle}
          links={[
            {
              linkSyntax: 'scams and security risks',
              linkStyle: pageStyles.richTextSpecialStyle,
              linkPress: () => {
                // TODO: change it
                console.log('!!!');
              },
            },
          ]}
        />
      </View>

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
      <FormItem title={'Decimal'} titleStyle={pageStyles.disableText}>
        <TextM style={[pageStyles.tokenDecimal, tokenItem.decimals !== '--' && FontStyles.font5]}>
          {tokenItem.decimals}
        </TextM>
      </FormItem>

      <View style={pageStyles.btnContainer}>
        <CommonButton onPress={addToken} disabled={btnDisable} type="primary">
          {t('Import')}
        </CommonButton>
      </View>
    </PageContainer>
  );
};

export default CustomToken;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: darkColors.bgBase1,
    ...gStyles.paddingArg(16, 20),
  },
  tipsSection: {
    color: defaultColors.font3,
    borderRadius: pTd(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: darkColors.borderWarning3,
    backgroundColor: darkColors.bgWarning3,
    padding: pTd(16),
    display: 'flex',
    flexDirection: 'row',
    marginBottom: pTd(16),
  },
  richTextWrap: {
    width: pTd(280),
  },
  richTextCommonStyle: {
    color: darkColors.textWarning3,
    fontSize: pTd(16),
  },
  richTextSpecialStyle: {
    color: darkColors.textBrand1,
    fontSize: pTd(16),
  },
  networkWrap: {
    paddingBottom: pTd(16),
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
    lineHeight: pTd(40),
    backgroundColor: darkColors.bgBase2,
    color: darkColors.textDisabled2,
    overflow: 'hidden',
    borderRadius: pTd(6),
    paddingLeft: pTd(16),
  },
  disableText: {
    color: darkColors.textDisabled1,
  },
});
