import { defaultColors } from 'assets/theme';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { getCryptoList } from '@portkey-wallet/api/api-did/payment/util';
import { ErrorType } from 'types/common';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';
import { CryptoInfoType } from '@portkey-wallet/api/api-did/payment/type';
import { CryptoItemType } from 'pages/Buy/types';
import { INIT_BUY_AMOUNT, tokenList } from 'pages/Buy/constants';
import Loading from 'components/Loading';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { useReceive } from 'pages/Buy/hooks';
import BigNumber from 'bignumber.js';
import { ZERO } from '@portkey-wallet/constants/misc';
import { PaymentLimitType, PaymentTypeEnum } from '@portkey-wallet/types/types-ca/payment';

export default function BuyForm() {
  const { buyFiatList: fiatList } = usePayment();

  const [fiat, setFiat] = useState<FiatType | undefined>(
    fiatList.find(item => item.currency === 'USD' && item.country === 'US'),
  );
  const [token, setToken] = useState<CryptoItemType>(tokenList[0]);
  const [amount, setAmount] = useState<string>(INIT_BUY_AMOUNT);
  const [amountLocalError, setAmountLocalError] = useState<ErrorType>(INIT_NONE_ERROR);

  const limitAmountRef = useRef<PaymentLimitType>();
  const cryptoListRef = useRef<CryptoInfoType[]>();
  const isRefreshReceiveValid = useRef<boolean>(false);
  const cryptoListCurrency = useRef<string>();

  useEffect(() => {
    if (fiat === undefined) {
      setFiat(fiatList.find(item => item.currency === 'USD' && item.country === 'US'));
    }
  }, [fiat, fiatList]);

  const setLimitAmount = useCallback(async () => {
    limitAmountRef.current = undefined;
    if (fiat === undefined || token === undefined) return;

    if (cryptoListRef.current === undefined || fiat.currency !== cryptoListCurrency.current) {
      Loading.show();
      try {
        const rst = await getCryptoList({ fiat: fiat.currency });
        cryptoListRef.current = rst;
        cryptoListCurrency.current = fiat.currency;
      } catch (error) {
        console.log(error);
      }
      Loading.hide();
    }
    if (token === undefined || cryptoListRef.current === undefined) return;
    const cryptoInfo = cryptoListRef.current.find(
      item => item.crypto === token.crypto && item.network === token.network && Number(item.buyEnable) === 1,
    );

    if (cryptoInfo === undefined || cryptoInfo.minPurchaseAmount === null || cryptoInfo.maxPurchaseAmount === null) {
      limitAmountRef.current = undefined;
      return;
    }

    limitAmountRef.current = {
      min: Number(ZERO.plus(cryptoInfo.minPurchaseAmount).decimalPlaces(4, BigNumber.ROUND_UP).valueOf()),
      max: Number(ZERO.plus(cryptoInfo.maxPurchaseAmount).decimalPlaces(4, BigNumber.ROUND_DOWN).valueOf()),
    };
  }, [fiat, token]);

  const {
    receiveAmount,
    rate,
    rateRefreshTime,
    refreshReceive,
    amountError: amountFetchError,
    isAllowAmount,
  } = useReceive(PaymentTypeEnum.BUY, amount, fiat, token, '', '', limitAmountRef, isRefreshReceiveValid);
  const refreshReceiveRef = useRef<typeof refreshReceive>();
  refreshReceiveRef.current = refreshReceive;

  const amountError = useMemo(() => {
    if (amountFetchError.isError && amountFetchError.errorMsg !== '') return amountFetchError;
    return amountLocalError;
  }, [amountFetchError, amountLocalError]);

  const onChooseChange = useCallback(async () => {
    isRefreshReceiveValid.current = false;
    setAmountLocalError(INIT_NONE_ERROR);
    await setLimitAmount();
    refreshReceiveRef.current?.();
  }, [setLimitAmount]);

  useEffect(() => {
    // only fiat||token change or init will trigger
    onChooseChange();
  }, [onChooseChange]);

  const onAmountInput = useCallback((text: string) => {
    isRefreshReceiveValid.current = false;
    setAmountLocalError(INIT_NONE_ERROR);
    const reg = /^(0|[1-9]\d*)(\.\d*)?$/;

    if (text === '') {
      setAmount('');
      return;
    }
    if (!reg.test(text)) return;
    setAmount(text);
  }, []);

  const onNext = useCallback(async () => {
    if (!limitAmountRef.current || !refreshReceiveRef.current) return;
    const amountNum = Number(amount);
    const { min, max } = limitAmountRef.current;
    if (amountNum < min || amountNum > max) {
      setAmountLocalError({
        ...INIT_HAS_ERROR,
        errorMsg: `Limit Amount ${formatAmountShow(min, 4)}-${formatAmountShow(max, 4)} ${fiat?.currency}`,
      });
      return;
    }
    let _rate = rate,
      _receiveAmount = receiveAmount;

    if (isRefreshReceiveValid.current === false) {
      Loading.show();
      const rst = await refreshReceiveRef.current();
      Loading.hide();
      if (!rst) return;
      _rate = rst.rate;
      _receiveAmount = rst.receiveAmount;
    }
    navigationService.navigate('BuyPreview', {
      amount,
      fiat,
      token,
      type: PaymentTypeEnum.BUY,
      receiveAmount: _receiveAmount,
      rate: _rate,
    });
  }, [amount, fiat, rate, receiveAmount, token]);

  return (
    <View style={styles.formContainer}>
      <View>
        <CommonInput
          label={'I want to pay'}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          value={amount}
          rightIcon={
            <Touchable
              style={styles.unitWrap}
              onPress={() => {
                SelectCurrency.showList({
                  value: `${fiat?.country}_${fiat?.currency}`,
                  list: fiatList,
                  callBack: setFiat,
                });
              }}>
              {fiat?.icon && <Image style={styles.unitIconStyle} source={{ uri: fiat?.icon }} />}
              <TextL style={[GStyles.flex1, fonts.mediumFont]}>{fiat?.currency}</TextL>
              <Svg size={16} icon="down-arrow" color={defaultColors.icon1} />
            </Touchable>
          }
          type="general"
          maxLength={30}
          autoCorrect={false}
          keyboardType="decimal-pad"
          onChangeText={onAmountInput}
          errorMessage={amountError.isError ? amountError.errorMsg : ''}
        />

        <CommonInput
          label={'I will receive≈'}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          disabled
          value={receiveAmount}
          rightIcon={
            <Touchable
              style={styles.unitWrap}
              onPress={() => {
                SelectToken.showList({
                  value: `${token.network}_${token.crypto}`,
                  list: tokenList,
                  callBack: setToken,
                });
              }}>
              <Svg size={24} icon="elf-icon" iconStyle={styles.unitIconStyle} />
              <TextL style={[GStyles.flex1, fonts.mediumFont]}>{token.crypto}</TextL>
              <Svg size={16} icon="down-arrow" color={defaultColors.icon1} />
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

      <CommonButton type="primary" disabled={!isAllowAmount} onPress={onNext}>
        Next
      </CommonButton>
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
    width: pTd(112),
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
