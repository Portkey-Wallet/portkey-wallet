import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Text } from 'react-native';
import { makeStyles } from '@rneui/themed';
import isEqual from 'lodash/isEqual';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useSellCryptoList } from '@portkey-wallet/hooks/hooks-ca/ramp';
import { IRampCryptoItem, IRampFiatItem, RampType } from '@portkey-wallet/ramp';
import { IRampLimit } from '@portkey-wallet/types/types-ca/ramp';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { ZERO } from '@portkey-wallet/constants/misc';
import { ErrorType, INIT_HAS_ERROR, INIT_NONE_ERROR } from '@portkey-wallet/constants/constants-ca/common';
import { isPotentialNumber } from '@portkey-wallet/utils/reg';
import { getELFChainBalance } from '@portkey-wallet/utils/balance';
import { getSellFiat, getSellLimit } from '@portkey-wallet/utils/ramp';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import GStyles from 'assets/theme/GStyles';
import PageContainer from 'components/PageContainer';
import CommonToast from 'components/CommonToast';
import Svg from 'components/Svg';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import Loading from 'components/Loading';
import Touchable from 'components/Touchable';
import { useCheckManagerSyncState } from 'hooks/wallet';
import { useAppRampEntryShow } from 'hooks/ramp';
import { useGetCurrentCAContract } from 'hooks/contract';
import { usePin } from 'hooks/store';
import { useCheckTransferLimitWithJump, useSecuritySafeCheckAndToast } from 'hooks/security';
import { getManagerAccount } from 'utils/redux';
import { useReceive } from '../hooks';
import CurrencySelector from '../components/CurrencySelector';

export interface ISellFormProps {
  symbol?: string;
  network?: string;
}

export default function RampSell() {
  const styles = getStyles();

  const { symbol, network } = useRouterParams<ISellFormProps>();

  const { sellCryptoList } = useSellCryptoList();
  const { refreshRampShow } = useAppRampEntryShow();

  const [fiatList, setFiatList] = useState<IRampFiatItem[]>([]);

  const [currency, setCurrency] = useState<{
    crypto?: IRampCryptoItem;
    fiat?: IRampFiatItem;
  }>({
    crypto: sellCryptoList.find(item => item.symbol === symbol && item.network === network),
    fiat: undefined,
  });
  const currencyRef = useRef(currency);
  currencyRef.current = currency;
  const crypto = useMemo(() => currency.crypto, [currency]);
  const fiat = useMemo(() => currency.fiat, [currency]);

  const checkManagerSyncState = useCheckManagerSyncState();
  useFetchTxFee();
  const { ach: achFee } = useGetTxFee(MAIN_CHAIN_ID);

  const [amount, setAmount] = useState<string>('');
  const [amountLocalError, setAmountLocalError] = useState<ErrorType>(INIT_NONE_ERROR);

  const chainInfo = useCurrentChain(MAIN_CHAIN_ID);
  const pin = usePin();
  const wallet = useCurrentWalletInfo();

  const refreshList = useCallback(async () => {
    Loading.show();
    try {
      const { sellFiatList, sellDefaultFiat } = await getSellFiat({
        crypto: symbol || '',
        network: network || '',
      });

      setFiatList(sellFiatList);
      const _fiat = sellFiatList.find(
        item => item.symbol === sellDefaultFiat.symbol && item.country === sellDefaultFiat.country,
      );

      setCurrency(pre => ({
        ...pre,
        fiat: _fiat,
      }));
    } catch (error) {
      console.log('sellForm refreshList error', error);
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
      const limitResult = await getSellLimit({
        crypto: _crypto.symbol,
        network: _crypto.network,
        fiat: _fiat.symbol,
        country: _fiat.country,
      });
      if (isEqual(_fiat, currencyRef.current.fiat) && isEqual(_crypto, currencyRef.current.crypto)) {
        limitAmountRef.current = limitResult;
      }
    } catch (error) {
      console.log('Sell setLimitAmount', error);
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
    type: RampType.SELL,
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

  const onFiatChange = useCallback((_fiat: IRampFiatItem) => {
    setCurrency(pre => ({ ...pre, fiat: _fiat }));
  }, []);

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

    if (text === '') {
      setAmount('');
      return;
    }
    if (!isPotentialNumber(text)) return;
    const arr = text.split('.');
    if (arr[1]?.length > 8) return;
    if (arr.join('').length > 13) return;
    setAmount(text);
  }, []);

  const defaultToken = useDefaultToken(MAIN_CHAIN_ID);
  const getCurrentCAContract = useGetCurrentCAContract(MAIN_CHAIN_ID);
  const checkTransferLimitWithJump = useCheckTransferLimitWithJump();
  const securitySafeCheckAndToast = useSecuritySafeCheckAndToast();
  const onNext = useCallback(async () => {
    if (!limitAmountRef.current || !refreshReceiveRef.current) return;
    const amountNum = Number(amount);
    const { minLimit, maxLimit } = limitAmountRef.current;

    if (amountNum < minLimit || amountNum > maxLimit) {
      setAmountLocalError({
        ...INIT_HAS_ERROR,
        errorMsg: `Limit Amount ${formatAmountShow(minLimit, 4)}-${formatAmountShow(maxLimit, 4)} ${
          crypto?.symbol || ''
        }`,
      });
      return;
    }

    let _rate = rate;

    const tokenContractAddress = defaultToken.address;
    const { decimals, symbol, chainId } = crypto || {};
    const { endPoint } = chainInfo || {};
    if (!tokenContractAddress || decimals === undefined || !symbol || !chainId) return;
    if (!pin || !endPoint) return;

    Loading.show();
    let isSellSectionShow = false;
    try {
      const result = await refreshRampShow();
      isSellSectionShow = result.isSellSectionShow;
    } catch (error) {
      console.log(error);
    }
    if (!isSellSectionShow) {
      CommonToast.fail('Sorry, the service you are using is temporarily unavailable.');
      navigationService.navigate('Tab');
      Loading.hide();
      return;
    }

    try {
      if (!(await securitySafeCheckAndToast(MAIN_CHAIN_ID))) {
        Loading.hide();
        return;
      }
    } catch (error) {
      CommonToast.failError(error);
      Loading.hide();
      return;
    }

    try {
      const _isManagerSynced = await checkManagerSyncState(chainId);
      if (!_isManagerSynced) {
        setAmountLocalError({
          ...INIT_HAS_ERROR,
          isWarning: true,
          errorMsg: 'Synchronizing on-chain account information...',
        });
        Loading.hide();
        return;
      }

      if (ZERO.plus(amount).isLessThanOrEqualTo(achFee)) {
        throw new Error('Insufficient funds');
      }
      const isRefreshReceiveValidValue = isRefreshReceiveValid.current;

      const account = getManagerAccount(pin);
      if (!account) return;

      const tokenContract = await getContractBasic({
        contractAddress: tokenContractAddress,
        rpcUrl: endPoint,
        account: account,
      });

      const balance = await getELFChainBalance(tokenContract, symbol, wallet?.[chainId]?.caAddress || '');

      if (divDecimals(balance, decimals).minus(achFee).isLessThan(amount)) {
        throw new Error('Insufficient funds');
      }

      if (isRefreshReceiveValidValue === false) {
        const rst = await refreshReceiveRef.current();
        if (!rst) return;
        _rate = rst.rate;
      }

      const navigateParams = {
        type: RampType.SELL,
        crypto,
        fiat,
        amount,
        rate: _rate,
      };

      const caContract = await getCurrentCAContract();
      const checkTransferLimitResult = await checkTransferLimitWithJump({
        caContract,
        symbol,
        decimals,
        amount,
        chainId,
        balance,
        approveMultiLevelParams: {
          successNavigate: {
            name: 'RampPreview',
            params: navigateParams,
          },
        },
      });
      if (!checkTransferLimitResult) {
        Loading.hide();
        return;
      }

      navigationService.navigate('RampPreview', navigateParams);
    } catch (error) {
      setAmountLocalError({ ...INIT_HAS_ERROR, errorMsg: 'Insufficient funds' });
      console.log('error', error);
    } finally {
      Loading.hide();
    }
  }, [
    amount,
    rate,
    defaultToken.address,
    crypto,
    chainInfo,
    pin,
    fiat,
    refreshRampShow,
    securitySafeCheckAndToast,
    checkManagerSyncState,
    achFee,
    getCurrentCAContract,
    checkTransferLimitWithJump,
    wallet,
  ]);

  const onChangeCurrency = useCallback(() => {
    if (!fiatList.length) return;
    CurrencySelector.showList({
      list: fiatList,
      selectedItem: currency.fiat || fiatList[0],
      onSelected: (item: IRampFiatItem) => {
        onFiatChange(item);
      },
    });
  }, [fiatList, onFiatChange, currency]);

  const rightDom = useMemo(() => {
    return (
      <Touchable style={styles.rightDom} onPress={onChangeCurrency}>
        <Svg icon={'change'} size={pTd(24)} iconStyle={GStyles.marginRight(4)} />
        <Text style={styles.rightDomText}>{currency.fiat?.symbol}</Text>
      </Touchable>
    );
  }, [currency, styles]);

  return (
    <PageContainer
      titleDom={`Sell ${symbol}`}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}></PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    ...GStyles.paddingArg(16, 16),
  },
  rightDom: {
    marginRight: pTd(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightDomText: {
    fontSize: pTd(16),
  },
}));
