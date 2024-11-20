import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';
import { makeStyles, useTheme } from '@rneui/themed';
import isEqual from 'lodash/isEqual';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
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
import { divDecimals, formatAmountShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import fonts from 'assets/theme/fonts';
import PageContainer from 'components/PageContainer';
import CommonToast from 'components/CommonToast';
import CommonAvatar from 'components/CommonAvatar';
import Svg from 'components/Svg';
import Loading from 'components/Loading';
import Touchable from 'components/Touchable';
import CommonButton from 'components/CommonButton';
import { KeyboardSafeArea } from 'components/KeyboardSafeArea';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
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

  const { symbol: routerSymbol, network: routerNetwork } = useRouterParams<ISellFormProps>();

  const textInputRef = useRef<TextInput>(null);
  const { theme } = useTheme();

  const { sellCryptoList } = useSellCryptoList();
  const { refreshRampShow } = useAppRampEntryShow();

  const [fiatList, setFiatList] = useState<IRampFiatItem[]>([]);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [currency, setCurrency] = useState<{
    crypto?: IRampCryptoItem;
    fiat?: IRampFiatItem;
  }>({
    crypto: sellCryptoList.find(item => item.symbol === routerSymbol && item.network === routerNetwork),
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
  const { accountTokenList } = useAccountTokenInfo();
  const tokenInfo = useMemo(() => {
    const tokenSection = accountTokenList.find(item => item.symbol === routerSymbol);
    return tokenSection?.tokens?.find(item => item.chainId === routerNetwork);
  }, [accountTokenList, routerSymbol, routerNetwork]);

  const refreshList = useCallback(async () => {
    Loading.show();
    try {
      const { sellFiatList, sellDefaultFiat } = await getSellFiat({
        crypto: routerSymbol || '',
        network: routerNetwork || '',
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
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }
  }, [routerNetwork, routerSymbol]);
  useEffectOnce(() => {
    refreshList();
  });

  const limitAmountRef = useRef<IRampLimit>();
  const isRefreshReceiveValid = useRef<boolean>(false);

  const setLimitAmount = useCallback(async () => {
    limitAmountRef.current = undefined;
    const { fiat: _fiat, crypto: _crypto } = currency;
    if (_fiat === undefined || _crypto === undefined) {
      return;
    }

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
    if (!isPotentialNumber(text)) {
      return;
    }
    const arr = text.split('.');
    if (arr[1]?.length > 8) {
      return;
    }
    if (arr.join('').length > 13) {
      return;
    }
    setAmount(text);
  }, []);

  const defaultToken = useDefaultToken(MAIN_CHAIN_ID);
  const getCurrentCAContract = useGetCurrentCAContract(MAIN_CHAIN_ID);
  const checkTransferLimitWithJump = useCheckTransferLimitWithJump();
  const securitySafeCheckAndToast = useSecuritySafeCheckAndToast();
  const onNext = useCallback(async () => {
    if (!limitAmountRef.current || !refreshReceiveRef.current) {
      return;
    }
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
    if (!tokenContractAddress || decimals === undefined || !symbol || !chainId) {
      return;
    }
    if (!pin || !endPoint) {
      return;
    }

    setButtonLoading(true);
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
      setButtonLoading(false);
      return;
    }

    try {
      if (!(await securitySafeCheckAndToast(MAIN_CHAIN_ID))) {
        setButtonLoading(false);
        return;
      }
    } catch (error) {
      CommonToast.failError(error);
      setButtonLoading(false);
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
        setButtonLoading(false);
        return;
      }

      if (ZERO.plus(amount).isLessThanOrEqualTo(achFee)) {
        throw new Error('Insufficient funds');
      }
      const isRefreshReceiveValidValue = isRefreshReceiveValid.current;

      const account = getManagerAccount(pin);
      if (!account) {
        return;
      }

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
        if (!rst) {
          return;
        }
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
        setButtonLoading(false);
        return;
      }

      navigationService.navigate('RampPreview', navigateParams);
    } catch (error) {
      setAmountLocalError({ ...INIT_HAS_ERROR, errorMsg: 'Insufficient funds' });
      console.log('error', error);
    } finally {
      setButtonLoading(false);
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
    setButtonLoading,
  ]);

  const onChangeCurrency = useCallback(() => {
    if (!fiatList.length) {
      return;
    }
    CurrencySelector.showList({
      list: fiatList,
      selectedItem: currency.fiat || fiatList[0],
      onSelected: (item: IRampFiatItem) => {
        onFiatChange(item);
      },
    });
  }, [fiatList, onFiatChange, currency]);

  const maxAmount = useMemo(() => {
    return formatTokenAmountShowWithDecimals(tokenInfo?.balance, tokenInfo?.decimals);
  }, [tokenInfo]);

  const onMaxPress = useCallback(() => {
    const maxAmountNumber = Number(maxAmount);
    if (Number.isNaN(maxAmountNumber)) {
      return;
    }
    if (ZERO.plus(amount).isLessThanOrEqualTo(achFee)) {
      CommonToast.fail('Insufficient funds');
      return;
    }
    onAmountInput(`${maxAmountNumber - achFee}`);
  }, [maxAmount, onAmountInput, achFee]);

  const rightDom = useMemo(() => {
    return (
      <Touchable style={styles.rightDom} onPress={onChangeCurrency}>
        <Svg icon={'change'} size={pTd(24)} iconStyle={GStyles.marginRight(4)} />
        <Text style={styles.rightDomText}>{currency.fiat?.symbol}</Text>
      </Touchable>
    );
  }, [currency, onChangeCurrency, styles]);

  const receiveAmountText = useMemo(() => {
    if (receiveAmount === '') {
      return `0 ${currency?.fiat?.symbol}`;
    }
    return `≈ ${receiveAmount} ${currency?.fiat?.symbol}`;
  }, [receiveAmount, currency]);

  return (
    <PageContainer
      titleDom={`Sell ${routerSymbol}`}
      containerStyles={styles.pageWrap}
      rightDom={rightDom}
      scrollViewProps={{ disabled: true }}>
      <View style={styles.tokenWrap}>
        <View style={styles.tokenInfoWrap}>
          <CommonAvatar
            hasBorder
            title={tokenInfo?.symbol}
            avatarSize={pTd(42)}
            imageUrl={tokenInfo?.imageUrl}
            svgName={tokenInfo?.svgName}
            titleStyle={FontStyles.font11}
            borderStyle={GStyles.hairlineBorder}
          />
          <View style={styles.tokenBalanceWrap}>
            <Text style={styles.tokenSymbolText}>{tokenInfo?.label || tokenInfo?.symbol}</Text>
            <Text style={styles.tokenBalanceText}>{`${maxAmount} available`}</Text>
          </View>
        </View>
        <Touchable style={styles.maxButton} onPress={onMaxPress}>
          <Text style={styles.maxButtonText}>Max</Text>
        </Touchable>
      </View>
      <View style={styles.cryptoWrap}>
        <TextInput
          placeholderTextColor={theme.colors.textBase3}
          value={amount}
          keyboardType="decimal-pad"
          ref={textInputRef}
          style={styles.cryptoInput}
          placeholder="0"
          onChangeText={onAmountInput}
        />
        <Touchable
          highlight={false}
          onPress={() => {
            if (textInputRef.current) {
              textInputRef.current.focus();
            }
          }}>
          <Text style={styles.cryptoText}>{currency.crypto?.symbol}</Text>
        </Touchable>
      </View>
      <Text style={styles.receiveAmount}>{receiveAmountText}</Text>
      {amountError.isError && <Text style={styles.warningText}>{amountError.errorMsg}</Text>}
      <View style={styles.flex} />
      <KeyboardSafeArea>
        <View style={styles.btnWrap}>
          <CommonButton
            loading={buttonLoading}
            type="primary"
            buttonStyle={styles.btnStyle}
            disabled={!isAllowAmount || amountError.isError}
            onPress={onNext}>
            Next
          </CommonButton>
        </View>
      </KeyboardSafeArea>
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    ...GStyles.paddingArg(0, 16),
  },
  flex: {
    flex: 1,
  },
  rightDom: {
    marginRight: pTd(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightDomText: {
    fontSize: pTd(16),
  },
  tokenWrap: {
    height: pTd(74),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tokenInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenBalanceWrap: {
    marginLeft: pTd(8),
  },
  tokenSymbolText: {
    fontSize: pTd(16),
    color: theme.colors.textBase1,
  },
  tokenBalanceText: {
    fontSize: pTd(14),
    color: theme.colors.textBase2,
  },
  maxButton: {
    width: pTd(84),
    height: pTd(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pTd(20),
    borderColor: theme.colors.borderNeutral2,
    borderWidth: StyleSheet.hairlineWidth,
  },
  maxButtonText: {
    fontSize: pTd(16),
    color: theme.colors.textBase1,
    ...fonts.BGMediumFont,
  },
  cryptoWrap: {
    marginTop: pTd(24),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cryptoInput: {
    fontSize: pTd(32),
    ...fonts.BGMediumFont,
  },
  cryptoText: {
    marginLeft: pTd(6),
    fontSize: pTd(32),
    ...fonts.BGMediumFont,
  },
  warningText: {
    width: '100%',
    textAlign: 'center',
    marginTop: pTd(8),
    fontSize: pTd(14),
    color: theme.colors.textDanger2,
  },
  receiveAmount: {
    marginTop: pTd(8),
    color: theme.colors.textBase2,
    fontSize: pTd(16),
    textAlign: 'center',
  },
  btnWrap: {
    paddingBottom: pTd(24),
  },
  btnStyle: {
    width: '100%',
  },
}));
