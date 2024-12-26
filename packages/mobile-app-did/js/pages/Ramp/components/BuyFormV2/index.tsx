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
import SelectCurrency from '../SelectCurrency';

import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import Loading from 'components/Loading';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { useReceive } from '../../hooks';
import CommonToast from 'components/CommonToast';
import { useBuyCryptoList } from '@portkey-wallet/hooks/hooks-ca/ramp';
import { IRampCryptoItem, IRampFiatItem, RampType } from '@portkey-wallet/ramp';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { IRampLimit } from '@portkey-wallet/types/types-ca/ramp';
import isEqual from 'lodash/isEqual';
import { getBuyFiat, getBuyLimit } from '@portkey-wallet/utils/ramp';
import CommonAvatar from 'components/CommonAvatar';
import { ErrorType, INIT_HAS_ERROR, INIT_NONE_ERROR } from '@portkey-wallet/constants/constants-ca/common';
import { isPotentialNumber } from '@portkey-wallet/utils/reg';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useAppRampEntryShow } from 'hooks/ramp';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';

export interface IBuyFormV2Props {
  symbol?: string;
  network?: string;
}

export default function BuyFormV2(props: IBuyFormV2Props) {
  const { symbol: routerSymbol, network: routerNetwork } = useRouterParams<IBuyFormV2Props>();
  const { symbol: propSymbol, network: propNetwork } = props;
  const symbol = useMemo(() => propSymbol || routerSymbol, [propSymbol, routerSymbol]);
  const network = useMemo(() => propNetwork || routerNetwork, [propNetwork, routerNetwork]);

  const defaultToken = useDefaultToken(MAIN_CHAIN_ID);

  const { refreshRampShow } = useAppRampEntryShow();

  const { buyCryptoList } = useBuyCryptoList();
  const [fiatList, setFiatList] = useState<IRampFiatItem[]>([]);

  const [currency, setCurrency] = useState<{
    crypto?: IRampCryptoItem;
    fiat?: IRampFiatItem;
  }>({
    crypto: buyCryptoList.find(item => item.symbol === symbol && item.network === network),
    fiat: undefined,
  });
  const currencyRef = useRef(currency);
  currencyRef.current = currency;
  const fiat = useMemo(() => currency.fiat, [currency]);
  const crypto = useMemo(() => currency.crypto, [currency]);

  const [amount, setAmount] = useState<string>('');
  const [amountLocalError, setAmountLocalError] = useState<ErrorType>(INIT_NONE_ERROR);

  const refreshList = useCallback(async () => {
    Loading.show();
    try {
      const { fiatList: buyFiatList, defaultFiat: buyDefaultFiat } = await getBuyFiat({ crypto: symbol, network });

      setFiatList(buyFiatList);
      const _fiat = buyFiatList.find(
        item => item.symbol === buyDefaultFiat.symbol && item.country === buyDefaultFiat.country,
      );
      setCurrency(pre => ({
        ...pre,
        fiat: _fiat,
      }));
    } catch (error) {
      console.log('buyForm refreshList error', error);
    } finally {
      Loading.hide();
    }
  }, [network, symbol]);
  useEffectOnce(() => {
    refreshList();
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
    setCurrency(pre => ({
      ...pre,
      fiat: _fiat,
    }));
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
                  hasBorder
                  title={fiat?.symbol || ''}
                  style={styles.unitIconStyle}
                  imageUrl={fiat?.icon}
                />
              )}
              <TextL style={[GStyles.flex1, fonts.mediumFont]}>{fiat?.symbol}</TextL>
              <Svg size={8} icon="solid-down-arrow" color={defaultColors.icon1} />
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
            <Touchable style={styles.unitWrap}>
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
              <Svg size={8} icon="solid-down-arrow" color={defaultColors.icon1} />
            </Touchable>
          }
          type="general"
          maxLength={30}
          autoCorrect={false}
          keyboardType="decimal-pad"
          placeholder=" "
        />

        {rate !== '' ? (
          <View style={styles.rateWrap}>
            <TextM style={[GStyles.flex1, FontStyles.font3]}>{`1 ${crypto?.symbol || ''} ≈ ${rate} ${
              fiat?.symbol || ''
            }`}</TextM>
            <View style={[GStyles.flexRow, GStyles.alignCenter]}>
              <Svg size={16} icon="time" />
              <TextS style={styles.refreshLabel}>{rateRefreshTime}s</TextS>
            </View>
          </View>
        ) : (
          <View style={styles.blank} />
        )}
      </View>

      <CommonButton type="primary" buttonStyle={styles.btnStyle} disabled={!isAllowAmount} onPress={onNext}>
        Next
      </CommonButton>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
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
    overflow: 'hidden',
  },
  unitIconStyle: {
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
  btnStyle: {
    marginTop: pTd(40),
  },
  blank: {
    height: pTd(18),
    width: '100%',
  },
});
