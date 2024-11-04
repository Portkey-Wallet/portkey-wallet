import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { makeStyles } from '@rneui/themed';
import isEqual from 'lodash/isEqual';
import { ErrorType, INIT_HAS_ERROR, INIT_NONE_ERROR } from '@portkey-wallet/constants/constants-ca/common';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useBuyCryptoList } from '@portkey-wallet/hooks/hooks-ca/ramp';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { getBuyFiat, getBuyLimit } from '@portkey-wallet/utils/ramp';
import { isPotentialNumber } from '@portkey-wallet/utils/reg';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { IRampCryptoItem, IRampFiatItem, RampType } from '@portkey-wallet/ramp';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { IRampLimit } from '@portkey-wallet/types/types-ca/ramp';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { useAppRampEntryShow } from 'hooks/ramp';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import Svg from 'components/Svg';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import { useReceive } from '../hooks';

export interface IBuyFormV2Props {
  symbol?: string;
  network?: string;
}

export default function RampBuy() {
  const styles = getStyles();
  const { symbol, network } = useRouterParams<IBuyFormV2Props>();

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

  const rightDom = useMemo(() => {
    return (
      <View style={styles.rightDom}>
        <Svg icon={'change'} size={pTd(24)} iconStyle={GStyles.marginRight(4)} />
        <Text style={styles.rightDomText}>{currency.fiat?.symbol}</Text>
      </View>
    );
  }, [currency, styles]);

  return (
    <PageContainer
      titleDom={`Buy ${symbol}`}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}
      rightDom={rightDom}>
      <View style={styles.fiatWrap}>
        <TextInput placeholder="0" />
        <Text>{currency.fiat?.symbol}</Text>
      </View>
      <View style={styles.cryptoWrap} />
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    ...GStyles.paddingArg(16, 16),
    alignItems: 'center',
  },
  rightDom: {
    marginRight: pTd(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightDomText: {
    fontSize: pTd(16),
  },
  fiatWrap: {},
  cryptoWrap: {},
}));
