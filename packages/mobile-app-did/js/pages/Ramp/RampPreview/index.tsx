import { defaultColors } from 'assets/theme';
import React, { useCallback, useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { TextM, TextS } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import achImg from 'assets/image/pngs/ach.png';
import achPaymentImg from 'assets/image/pngs/ach_payment.png';
import ActionSheet from 'components/ActionSheet';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useReceive } from '../hooks';
import { useGetAchTokenInfo } from '@portkey-wallet/hooks/hooks-ca/payment';
import { getAchSignature, getPaymentOrderNo } from '@portkey-wallet/api/api-did/payment/util';
import { ACH_MERCHANT_NAME, TransDirectEnum } from '@portkey-wallet/constants/constants-ca/payment';
import navigationService from 'utils/navigationService';
import { useCurrentApiUrl } from '@portkey-wallet/hooks/hooks-ca/network';
import paymentApi from '@portkey-wallet/api/api-did/payment';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import { ACH_REDIRECT_URL, ACH_WITHDRAW_URL } from 'constants/common';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useAppBuyButtonShow } from 'hooks/cms';
import { IRampCryptoItem, IRampFiatItem, RampType } from '@portkey-wallet/ramp';

interface RouterParams {
  type?: RampType;
  crypto?: IRampCryptoItem;
  fiat?: IRampFiatItem;
  amount?: string;
  receiveAmount?: string;
  rate?: string;
}

export default function RampPreview() {
  const {
    type = RampType.BUY,
    crypto,
    fiat,
    amount,
    receiveAmount: receiveAmountProps,
    rate: rateProps,
  } = useRouterParams<RouterParams>();

  const { t } = useLanguage();
  const defaultToken = useDefaultToken();
  const { rate, receiveAmount, providerPriceList } = useReceive({
    type,
    amount: amount || '',
    fiat,
    crypto,
    initialReceiveAmount: receiveAmountProps,
    initialRate: rateProps,
    isProviderShow: true,
  });
  const isBuy = useMemo(() => type === RampType.BUY, [type]);
  const apiUrl = useCurrentApiUrl();
  const wallet = useCurrentWalletInfo();
  const { buyConfig } = useCurrentNetworkInfo();
  const { refreshBuyButton } = useAppBuyButtonShow();

  const getAchTokenInfo = useGetAchTokenInfo();
  const goPayPage = useCallback(
    async (isNoEmail = false) => {
      const appId = buyConfig?.ach?.appId;
      const baseUrl = buyConfig?.ach?.baseUrl;
      if (!amount || !receiveAmount || !fiat || !crypto || !appId || !baseUrl) return;
      Loading.show();

      let isSectionShow = false;
      try {
        const result = await refreshBuyButton();
        isSectionShow = type === RampType.BUY ? result.isBuySectionShow : result.isSellSectionShow;
      } catch (error) {
        console.log(error);
      }
      if (!isSectionShow) {
        CommonToast.fail('Sorry, the service you are using is temporarily unavailable.');
        navigationService.navigate('Tab');
        Loading.hide();
        return;
      }

      try {
        const callbackUrl = encodeURIComponent(`${apiUrl}${paymentApi.updateAchOrder}`);
        let achUrl = `${baseUrl}/?crypto=${crypto.symbol}&network=${crypto.network}&country=${fiat.country}&fiat=${fiat.symbol}&appId=${appId}&callbackUrl=${callbackUrl}`;

        const orderNo = await getPaymentOrderNo({
          transDirect: type === RampType.BUY ? TransDirectEnum.TOKEN_BUY : TransDirectEnum.TOKEN_SELL,
          merchantName: ACH_MERCHANT_NAME,
        });
        achUrl += `&merchantOrderNo=${orderNo}`;

        if (type === RampType.BUY) {
          const achTokenInfo = await getAchTokenInfo();
          if (achTokenInfo !== undefined && isNoEmail === false) {
            achUrl += `&token=${encodeURIComponent(achTokenInfo.token)}`;
          }

          const address = wallet.AELF?.caAddress;
          if (!address) {
            throw new Error('address is undefined');
          }
          achUrl += `&address=${address}`;

          const signature = await getAchSignature({ address });
          achUrl += `&type=buy&fiatAmount=${amount}&redirectUrl=${encodeURIComponent(
            ACH_REDIRECT_URL,
          )}&sign=${encodeURIComponent(signature)}`;
        } else {
          const withdrawUrl = encodeURIComponent(ACH_WITHDRAW_URL);
          achUrl += `&type=sell&cryptoAmount=${amount}&withdrawUrl=${withdrawUrl}&source=3#/sell-formUserInfo`;
        }

        console.log('achUrl', achUrl);
        // const injectedJavaScript: string | undefined =
        //   achTokenInfo === undefined || isNoEmail
        //     ? `
        //     if ( window.location.href.startsWith('${achUrl}') ) {
        //       window.localStorage.removeItem('token');
        //       window.localStorage.removeItem('login_email');
        //     }`
        //     : undefined;
        const injectedJavaScript = undefined;

        navigationService.navigate('ViewOnWebView', {
          title: 'Alchemy Pay Ramp',
          url: achUrl,
          webViewPageType: type === RampType.BUY ? 'ach' : 'achSell',
          injectedJavaScript,
          params:
            type === RampType.BUY
              ? undefined
              : {
                  orderNo,
                },
        });
      } catch (error) {
        CommonToast.fail(`There is a network error, please try again.`);
        console.log(error);
      }
      Loading.hide();
    },
    [
      amount,
      apiUrl,
      buyConfig?.ach?.appId,
      buyConfig?.ach?.baseUrl,
      fiat,
      getAchTokenInfo,
      receiveAmount,
      refreshBuyButton,
      crypto,
      type,
      wallet.AELF?.caAddress,
    ],
  );

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={`${t(isBuy ? 'Buy' : 'Sell')} ${defaultToken.symbol} `}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        <View style={styles.amountContainer}>
          <View style={styles.primaryWrap}>
            <Text style={styles.primaryAmount}>{amount}</Text>
            <TextM style={styles.primaryUnit}>{isBuy ? fiat?.symbol || '' : crypto?.symbol || ''}</TextM>
          </View>
          <TextM style={FontStyles.font3}>
            I will receive {receiveAmount} {isBuy ? crypto?.symbol || '' : fiat?.symbol || ''}
          </TextM>
        </View>

        <TextS style={GStyles.marginLeft(8)}>Service provider</TextS>
        <View style={styles.paymentWrap}>
          <View style={[GStyles.flexRow, GStyles.spaceBetween, GStyles.itemCenter, GStyles.marginBottom(24)]}>
            <Image resizeMode="contain" source={achImg} style={styles.achImgStyle} />
            <TextM style={FontStyles.font3}>{`1 ${crypto?.symbol || ''} ≈ ${rate} ${fiat?.symbol}`}</TextM>
          </View>
          <Image resizeMode="contain" source={achPaymentImg} style={styles.achPaymentImgStyle} />
        </View>
      </View>
      <View>
        <TextM style={GStyles.marginBottom(26)}>
          Proceeding with this transaction means that you have read and understood{' '}
          <TextM
            style={FontStyles.font4}
            onPress={() => {
              ActionSheet.alert({
                title: 'Disclaimer',
                title2: (
                  <TextM style={[FontStyles.font3, GStyles.textAlignCenter, GStyles.marginBottom(20)]}>
                    AlchemyPay is a fiat-to-crypto platform independently operated by a third-party entity. Portkey
                    shall not be held liable for any losses or damages suffered as a result of using AlchemyPay
                    services.
                  </TextM>
                ),
                buttons: [{ title: 'OK' }],
              });
            }}>
            the Disclaimer
          </TextM>
          .
        </TextM>
        <CommonButton
          type="primary"
          onPress={() => {
            goPayPage();
          }}>
          Go to AlchemyPay
        </CommonButton>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(60, 20, 16, 20),
  },
  amountContainer: {
    marginBottom: pTd(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryWrap: {
    marginBottom: pTd(12),
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  primaryAmount: {
    fontSize: pTd(30),
    lineHeight: pTd(34),
    marginRight: pTd(8),
    color: defaultColors.font5,
    ...fonts.mediumFont,
  },
  primaryUnit: {
    ...fonts.mediumFont,
    marginBottom: pTd(4),
  },
  paymentWrap: {
    marginTop: pTd(8),
    borderRadius: pTd(6),
    borderColor: defaultColors.border6,
    borderWidth: StyleSheet.hairlineWidth,
    ...GStyles.paddingArg(16, 12),
  },
  achImgStyle: {
    height: pTd(22),
  },
  achPaymentImgStyle: {
    height: pTd(20),
  },
});
