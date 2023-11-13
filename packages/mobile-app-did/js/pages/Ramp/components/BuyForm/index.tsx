import { defaultColors } from 'assets/theme';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM, TextS } from 'components/CommonText';

import CommonInput from 'components/CommonInput';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import fonts from 'assets/theme/fonts';
import SelectToken from '../SelectToken';
import SelectCurrency from '../SelectCurrency';

import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { ErrorType } from 'types/common';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';
import Loading from 'components/Loading';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { useReceive } from '../../hooks';
import CommonToast from 'components/CommonToast';
import { useAppBuyButtonShow } from 'hooks/cms';
import { useBuyFiat } from '@portkey-wallet/hooks/hooks-ca/ramp';
import { IRampCryptoItem, IRampFiatItem, RampType } from '@portkey-wallet/ramp';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { IRampLimit } from '@portkey-wallet/types/types-ca/ramp';
import isEqual from 'lodash/isEqual';
import { getBuyLimit } from '@portkey-wallet/utils/ramp';
import CommonAvatar from 'components/CommonAvatar';

export default function BuyForm() {
  const {
    buyFiatList: fiatListState,
    buyDefaultFiat: defaultFiat,
    buyDefaultCryptoList: defaultCryptoList,
    buyDefaultCrypto: defaultCrypto,
    refreshBuyFiat,
  } = useBuyFiat();

  const { refreshBuyButton } = useAppBuyButtonShow();

  const [fiatList, setFiatList] = useState<IRampFiatItem[]>(fiatListState);
  const [fiat, setFiat] = useState<IRampFiatItem | undefined>(
    fiatList.find(item => item.symbol === defaultFiat.symbol && item.country === defaultFiat.country),
  );
  const fiatRef = useRef<IRampFiatItem | undefined>(fiat);
  fiatRef.current = fiat;

  const [cryptoList, setCryptoList] = useState<IRampCryptoItem[]>(defaultCryptoList);
  const [crypto, setCrypto] = useState<IRampCryptoItem | undefined>(
    defaultCryptoList.find(item => item.symbol === defaultCrypto.symbol && item.network === defaultCrypto.network),
  );
  const cryptoRef = useRef<IRampCryptoItem | undefined>(crypto);
  cryptoRef.current = crypto;

  const [amount, setAmount] = useState<string>(defaultFiat.amount);
  const [amountLocalError, setAmountLocalError] = useState<ErrorType>(INIT_NONE_ERROR);

  const refreshList = useCallback(async () => {
    try {
      const { buyDefaultFiat, buyFiatList, buyDefaultCryptoList, buyDefaultCrypto } = await refreshBuyFiat();
      setFiatList(buyFiatList);
      setCryptoList(buyDefaultCryptoList);
      const _fiat = buyFiatList.find(
        item => item.symbol === buyDefaultFiat.symbol && item.country === buyDefaultFiat.country,
      );
      const _crypto = buyDefaultCryptoList.find(
        item => item.symbol === buyDefaultCrypto.symbol && item.network === buyDefaultCrypto.network,
      );
      if (_fiat) {
        setFiat(pre => {
          if (_fiat.symbol !== pre?.symbol || _fiat.country !== pre?.country) {
            return _fiat;
          }
          return pre;
        });
      }
      if (_crypto) {
        setCrypto(pre => {
          if (_crypto.symbol !== pre?.symbol || _crypto.network !== pre?.network) {
            return _crypto;
          }
          return pre;
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [refreshBuyFiat]);
  useEffectOnce(() => {
    refreshList();
  });

  const limitAmountRef = useRef<IRampLimit>();
  const isRefreshReceiveValid = useRef<boolean>(false);

  const setLimitAmount = useCallback(async () => {
    limitAmountRef.current = undefined;
    if (fiat === undefined || crypto === undefined) return;

    const loadingKey = Loading.show();
    try {
      const limitResult = await getBuyLimit({
        crypto: crypto.symbol,
        network: crypto.network,
        fiat: fiat.symbol,
        country: fiat.country,
      });
      if (isEqual(fiat, fiatRef.current) && isEqual(crypto, cryptoRef.current)) {
        limitAmountRef.current = limitResult;
      }
    } catch (error) {
      console.log('Buy setLimitAmount', error);
    }
    Loading.hide(loadingKey);
  }, [fiat, crypto]);

  const {
    receiveAmount,
    rate,
    rateRefreshTime,
    refreshReceive,
    amountError: amountFetchError,
    isAllowAmount,
  } = useReceive({
    type: RampType.BUY,
    amount,
    fiat,
    crypto,
    initialReceiveAmount: '',
    initialRate: '',
    limitAmountRef,
    isRefreshReceiveValid,
  });
  const refreshReceiveRef = useRef<typeof refreshReceive>();
  refreshReceiveRef.current = refreshReceive;

  const amountError = useMemo(() => {
    if (amountFetchError.isError && amountFetchError.errorMsg !== '') {
      return amountFetchError;
    }
    return amountLocalError;
  }, [amountFetchError, amountLocalError]);

  const onChooseChange = useCallback(async () => {
    isRefreshReceiveValid.current = false;
    setAmountLocalError(INIT_NONE_ERROR);
    await setLimitAmount();
    refreshReceiveRef.current?.();
  }, [setLimitAmount]);

  useEffect(() => {
    // only fiat||crypto change or init will trigger
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
    const { minLimit, maxLimit } = limitAmountRef.current;
    if (amountNum < minLimit || amountNum > maxLimit) {
      setAmountLocalError({
        ...INIT_HAS_ERROR,
        errorMsg: `Limit Amount ${formatAmountShow(minLimit, 4)}-${formatAmountShow(maxLimit, 4)} ${
          fiat?.symbol || ''
        }`,
      });
      return;
    }

    Loading.show();
    let isBuySectionShow = false;
    try {
      const result = await refreshBuyButton();
      isBuySectionShow = result.isBuySectionShow;
    } catch (error) {
      console.log(error);
    }
    if (!isBuySectionShow) {
      CommonToast.fail('Sorry, the service you are using is temporarily unavailable.');
      navigationService.navigate('Tab');
      Loading.hide();
      return;
    }

    let _rate = rate,
      _receiveAmount = receiveAmount;

    if (isRefreshReceiveValid.current === false) {
      const rst = await refreshReceiveRef.current();
      Loading.hide();
      if (!rst) return;
      _rate = rst.rate;
      _receiveAmount = rst.receiveAmount;
    }

    Loading.hide();
    navigationService.navigate('RampPreview', {
      amount,
      fiat,
      crypto,
      type: RampType.BUY,
      receiveAmount: _receiveAmount,
      rate: _rate,
    });
  }, [amount, fiat, rate, receiveAmount, refreshBuyButton, crypto]);

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
                  value: `${fiat?.country}_${fiat?.symbol}`,
                  list: fiatList,
                  callBack: setFiat,
                });
              }}>
              {fiat?.icon && (
                <CommonAvatar hasBorder title={fiat?.symbol || ''} style={styles.unitIconStyle} imageUrl={fiat?.icon} />
              )}
              <TextL style={[GStyles.flex1, fonts.mediumFont]}>{fiat?.symbol}</TextL>
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
                  value: `${crypto?.network}_${crypto?.symbol}`,
                  list: cryptoList,
                  callBack: setCrypto,
                });
              }}>
              {crypto?.icon && (
                <CommonAvatar
                  hasBorder
                  title={crypto?.symbol || ''}
                  style={styles.unitIconStyle}
                  imageUrl={crypto?.icon}
                />
              )}
              <TextL style={[GStyles.flex1, fonts.mediumFont]}>{crypto?.symbol || ''}</TextL>
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
            <TextM style={[GStyles.flex1, FontStyles.font3]}>{`1 ${crypto?.symbol || ''} ≈ ${rate} ${
              fiat?.symbol || ''
            }`}</TextM>
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
