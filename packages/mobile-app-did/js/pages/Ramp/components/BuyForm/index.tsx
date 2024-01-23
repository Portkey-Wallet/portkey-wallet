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
import Loading from 'components/Loading';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { useReceive } from '../../hooks';
import CommonToast from 'components/CommonToast';
import { useBuyFiat, useRampEntryShow } from '@portkey-wallet/hooks/hooks-ca/ramp';
import { IRampCryptoItem, IRampFiatItem, RampType } from '@portkey-wallet/ramp';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { IRampLimit } from '@portkey-wallet/types/types-ca/ramp';
import isEqual from 'lodash/isEqual';
import { getBuyCrypto, getBuyLimit } from '@portkey-wallet/utils/ramp';
import CommonAvatar from 'components/CommonAvatar';
import { ErrorType, INIT_HAS_ERROR, INIT_NONE_ERROR } from '@portkey-wallet/constants/constants-ca/common';
import { isPotentialNumber } from '@portkey-wallet/utils/reg';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';

export default function BuyForm() {
  const {
    buyFiatList: fiatListState,
    buyDefaultFiat: defaultFiat,
    buyDefaultCryptoList: defaultCryptoList,
    buyDefaultCrypto: defaultCrypto,
    refreshBuyFiat,
  } = useBuyFiat();

  const defaultToken = useDefaultToken();

  const { refreshRampShow } = useRampEntryShow();

  const [fiatList, setFiatList] = useState<IRampFiatItem[]>(fiatListState);
  const [cryptoList, setCryptoList] = useState<IRampCryptoItem[]>(defaultCryptoList);
  const [currency, setCurrency] = useState({
    crypto: defaultCryptoList.find(
      item => item.symbol === defaultCrypto.symbol && item.network === defaultCrypto.network,
    ),
    fiat: fiatListState.find(item => item.symbol === defaultFiat.symbol && item.country === defaultFiat.country),
  });
  const currencyRef = useRef(currency);
  currencyRef.current = currency;
  const fiat = useMemo(() => currency.fiat, [currency]);
  const crypto = useMemo(() => currency.crypto, [currency]);

  const [amount, setAmount] = useState<string>(defaultFiat.amount);
  const [amountLocalError, setAmountLocalError] = useState<ErrorType>(INIT_NONE_ERROR);

  const refreshList = useCallback(async () => {
    Loading.show();
    try {
      const { buyDefaultFiat, buyFiatList, buyDefaultCryptoList, buyDefaultCrypto } = await refreshBuyFiat();
      Loading.hide();
      setFiatList(buyFiatList);
      setCryptoList(buyDefaultCryptoList);
      const _fiat = buyFiatList.find(
        item => item.symbol === buyDefaultFiat.symbol && item.country === buyDefaultFiat.country,
      );
      const _crypto = buyDefaultCryptoList.find(
        item => item.symbol === buyDefaultCrypto.symbol && item.network === buyDefaultCrypto.network,
      );
      setAmount(buyDefaultFiat.amount);
      setCurrency({
        crypto: _crypto,
        fiat: _fiat,
      });
    } catch (error) {
      Loading.hide();
      console.log('error', error);
    }
  }, [refreshBuyFiat]);
  useEffectOnce(() => {
    if (fiatListState.length === 0 || defaultCryptoList.length === 0) {
      refreshList();
    }
  });

  const limitAmountRef = useRef<IRampLimit>();
  const isRefreshReceiveValid = useRef<boolean>(false);

  const setLimitAmount = useCallback(async () => {
    limitAmountRef.current = undefined;
    const { fiat: _fiat, crypto: _crypto } = currency;
    if (_fiat === undefined || _crypto === undefined) return;

    const loadingKey = Loading.show();
    try {
      const limitResult = await getBuyLimit({
        crypto: _crypto.symbol,
        network: _crypto.network,
        fiat: _fiat.symbol,
        country: _fiat.country,
      });
      if (isEqual(_fiat, currencyRef.current.fiat) && isEqual(_crypto, currencyRef.current.crypto)) {
        limitAmountRef.current = limitResult;
      }
    } catch (error) {
      console.log('Buy setLimitAmount', error);
    }
    Loading.hide(loadingKey);
  }, [currency]);

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

  const onFiatChange = useCallback(async (_fiat: IRampFiatItem) => {
    try {
      const { buyCryptoList: _cryptoList, buyDefaultCrypto: _defaultCrypto } = await getBuyCrypto({
        fiat: _fiat.symbol,
        country: _fiat.country,
      });
      setCryptoList(_cryptoList);
      setCurrency({
        fiat: _fiat,
        crypto: _cryptoList.find(
          item => item.symbol === _defaultCrypto.symbol && item.network === _defaultCrypto.network,
        ),
      });
    } catch (error) {
      console.log('onFiatChange', error);
    }
  }, []);

  const onCryptoChange = useCallback((_crypto: IRampCryptoItem) => {
    setCurrency(pre => ({ ...pre, crypto: _crypto }));
  }, []);

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

    if (text === '') {
      setAmount('');
      return;
    }
    if (!isPotentialNumber(text)) return;
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
      const result = await refreshRampShow();
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

    let _rate = rate;
    if (isRefreshReceiveValid.current === false) {
      const rst = await refreshReceiveRef.current();
      Loading.hide();
      if (!rst) return;
      _rate = rst.rate;
    }

    Loading.hide();
    navigationService.navigate('RampPreview', {
      amount,
      fiat,
      crypto,
      type: RampType.BUY,
      rate: _rate,
    });
  }, [amount, fiat, rate, refreshRampShow, crypto]);

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
                  callBack: onFiatChange,
                });
              }}>
              {fiat?.icon && (
                <CommonAvatar
                  avatarSize={pTd(24)}
                  width={pTd(24)}
                  height={pTd(24)}
                  hasBorder
                  title={fiat?.symbol || ''}
                  style={styles.unitIconStyle}
                  imageUrl={fiat?.icon}
                />
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
                  callBack: onCryptoChange,
                });
              }}>
              {crypto?.icon && (
                <CommonAvatar
                  hasBorder
                  title={crypto?.symbol || ''}
                  style={styles.unitIconStyle}
                  // elf token icon is fixed , only use white background color
                  svgName={crypto?.symbol === defaultToken.symbol ? 'testnet' : undefined}
                  imageUrl={crypto?.icon}
                  avatarSize={pTd(24)}
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
