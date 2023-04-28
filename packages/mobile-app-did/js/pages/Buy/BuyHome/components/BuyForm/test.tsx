import { defaultColors } from 'assets/theme';
import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM, TextS } from 'components/CommonText';

import CommonInput from 'components/CommonInput';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import fonts from 'assets/theme/fonts';
import SelectToken from '../SelectToken';
import { usePayment } from 'hooks/store';
import SelectCurrency from '../SelectCurrency';
import { FiatType } from '@portkey-wallet/store/store-ca/payment/type';
import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { countryCodeMap } from '@portkey-wallet/constants/constants-ca/payment';
import { CryptoItemType } from 'pages/Buy/types';
import { tokenList } from 'pages/Buy/constants';
import { useTestAmountPrice } from 'pages/Buy/hooks';
import CommonToast from 'components/CommonToast';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';

const RECEIVE_AMOUNT = 100;

const initialFiat: FiatType = {
  currency: 'USD',
  country: 'US',
  payWayCode: '',
  payWayName: '',
  fixedFee: 0,
  rateFee: 0,
  payMin: 0,
  payMax: 0,
};

export default function BuyTestForm() {
  const { buyFiatList: fiatList } = usePayment();
  const [fiat, setFiat] = useState<FiatType | undefined>(initialFiat);
  const [token, setToken] = useState<CryptoItemType>(tokenList[0]);

  const { amount, rate, rateRefreshTime } = useTestAmountPrice(RECEIVE_AMOUNT, fiat, token);

  const currentWallet = useCurrentWalletInfo();
  const onNext = useCallback(async () => {
    // AELF caInfo may in sync
    if (!currentWallet.AELF) {
      CommonToast.smile('Synchronizing on-chain account information...');
      return;
    }

    navigationService.navigate('BuyTestPreview', { token, fiat, amount, rate, receiveAmount: RECEIVE_AMOUNT });
  }, [amount, currentWallet.AELF, fiat, rate, token]);

  return (
    <View style={styles.formContainer}>
      <View>
        <CommonInput
          label={'I want to pay'}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          value={amount}
          disabled
          rightIcon={
            <Touchable
              style={styles.unitWrap}
              disabled
              onPress={() => {
                SelectCurrency.showList({
                  value: `${fiat?.country}_${fiat?.currency}`,
                  list: fiatList,
                  callBack: setFiat,
                });
              }}>
              {countryCodeMap[fiat?.country || '']?.icon && (
                <Image style={styles.unitIconStyle} source={{ uri: countryCodeMap[fiat?.country || '']?.icon }} />
              )}
              <TextL style={[GStyles.flex1, fonts.mediumFont]}>{fiat?.currency}</TextL>
            </Touchable>
          }
          type="general"
          maxLength={30}
          autoCorrect={false}
          keyboardType="decimal-pad"
          // placeholder={t('Enter Phone Number')}
        />

        <CommonInput
          label={'I will receive≈'}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          disabled
          value={RECEIVE_AMOUNT.toString()}
          rightIcon={
            <Touchable
              style={styles.unitWrap}
              disabled
              onPress={() => {
                SelectToken.showList({
                  value: `${token.network}_${token.crypto}`,
                  list: tokenList,
                  callBack: setToken,
                });
              }}>
              <Svg size={24} icon="elf-icon" iconStyle={styles.unitIconStyle} />
              <TextL style={[GStyles.flex1, fonts.mediumFont]}>{token.crypto}</TextL>
            </Touchable>
          }
          type="general"
          maxLength={30}
          autoCorrect={false}
          keyboardType="decimal-pad"
          placeholder=" "
        />

        {rate !== '' && (
          <View style={styles.rateWrap}>
            <TextM style={[GStyles.flex1, FontStyles.font3]}>{`1 ${token?.crypto} ≈ ${rate} ${fiat?.currency}`}</TextM>
            <View style={[GStyles.flexRow, GStyles.alignCenter]}>
              <Svg size={16} icon="time" />
              <TextS style={styles.refreshLabel}>{rateRefreshTime}s</TextS>
            </View>
          </View>
        )}
      </View>

      <View>
        <TextM style={[FontStyles.font3, GStyles.marginBottom(18)]}>
          {`This is a simulated on-ramp purchase on aelf's Testnet with virtual payment method. The tokens you will receive are Testnet tokens.`}
        </TextM>

        <CommonButton type="primary" onPress={onNext}>
          Next
        </CommonButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    height: '100%',
    justifyContent: 'space-between',
  },
  inputContainerStyle: {
    height: pTd(64),
  },
  inputStyle: {
    fontSize: pTd(24),
    ...fonts.mediumFont,
  },
  unitWrap: {
    width: pTd(96),
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftColor: defaultColors.border6,
    borderLeftWidth: StyleSheet.hairlineWidth,
    paddingLeft: pTd(12),
  },
  unitIconStyle: {
    width: pTd(24),
    height: pTd(24),
    marginRight: pTd(8),
  },
  rateWrap: {
    flexDirection: 'row',
    paddingHorizontal: pTd(8),
  },
  refreshLabel: {
    marginLeft: pTd(4),
    color: defaultColors.font3,
  },
});
