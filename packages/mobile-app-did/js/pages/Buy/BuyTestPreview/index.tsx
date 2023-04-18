import { defaultColors } from 'assets/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM, TextS } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import { FiatType } from '@portkey-wallet/store/store-ca/payment/type';
import Svg from 'components/Svg';
import { CryptoItemType } from '../types';
import navigationService from 'utils/navigationService';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useTestAmountPrice } from '../hooks';

interface RouterParams {
  token?: CryptoItemType;
  fiat?: FiatType;
  amount?: string;
  receiveAmount: number;
  rate?: string;
}

export default function BuyPreview() {
  const { token, fiat, amount: amountProps, receiveAmount } = useRouterParams<RouterParams>();

  const { t } = useLanguage();

  const { amount } = useTestAmountPrice(receiveAmount, fiat, token, amountProps);

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={t('Buy ELF')}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        <View style={styles.amountContainer}>
          <View style={styles.primaryWrap}>
            <Text style={styles.primaryAmount}>{amount}</Text>
            <TextM style={styles.primaryUnit}>{fiat?.currency}</TextM>
          </View>
          <TextM style={FontStyles.font3}>
            I will receive ≈ {receiveAmount} {token?.crypto || ''}
          </TextM>
        </View>

        <TextS style={[FontStyles.font3, GStyles.marginLeft(8)]}>Choose payment method</TextS>
        <View style={styles.paymentWrap}>
          <Svg icon="visa" oblongSize={[pTd(32), pTd(16)]} iconStyle={styles.paymentIcon} />
          <View style={styles.paymentContent}>
            <TextL>Visa Card</TextL>
            <TextM style={[FontStyles.font3, GStyles.marginLeft(8)]}>(****7760)</TextM>
          </View>
        </View>
      </View>

      <CommonButton
        type="primary"
        onPress={() => {
          navigationService.navigate('BuyTestConfirm', {
            token,
            fiat,
            amount,
            receiveAmount,
          });
        }}>
        Proceed
      </CommonButton>
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
    height: pTd(34),
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
    flexDirection: 'row',
    alignItems: 'center',
    height: pTd(72),
    ...GStyles.paddingArg(0, 12),
  },
  paymentIcon: {
    marginRight: pTd(16),
    borderColor: defaultColors.border6,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: pTd(6),
    ...GStyles.paddingArg(pTd(6), pTd(6)),
  },
  paymentContent: {
    flex: 1,
    flexDirection: 'row',
  },
});
