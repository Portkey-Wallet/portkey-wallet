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
import { usePin } from 'hooks/store';
import SelectCurrency from '../SelectCurrency';
import { ErrorType, INIT_HAS_ERROR, INIT_NONE_ERROR } from '@portkey-wallet/constants/constants-ca/common';
import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import Loading from 'components/Loading';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { useReceive } from '../../hooks';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { getManagerAccount } from 'utils/redux';
import { getELFChainBalance } from '@portkey-wallet/utils/balance';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ZERO } from '@portkey-wallet/constants/misc';
import CommonToast from 'components/CommonToast';
import { useCheckManagerSyncState } from 'hooks/wallet';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { useSellCrypto } from '@portkey-wallet/hooks/hooks-ca/ramp';
import { IRampCryptoItem, IRampFiatItem, RampType } from '@portkey-wallet/ramp';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { IRampLimit } from '@portkey-wallet/types/types-ca/ramp';
import isEqual from 'lodash/isEqual';
import { getSellFiat, getSellLimit } from '@portkey-wallet/utils/ramp';
import CommonAvatar from 'components/CommonAvatar';
import { useCheckTransferLimitWithJump, useSecuritySafeCheckAndToast } from 'hooks/security';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { useGetCurrentCAContract } from 'hooks/contract';
import { isPotentialNumber } from '@portkey-wallet/utils/reg';
import { useAppRampEntryShow } from 'hooks/ramp';

export default function SellForm() {
  const {
    sellCryptoList: cryptoListState,
    sellDefaultCrypto: defaultCrypto,
    sellDefaultFiatList: defaultFiatList,
    sellDefaultFiat: defaultFiat,
    refreshSellCrypto,
  } = useSellCrypto();

  const { refreshRampShow } = useAppRampEntryShow();

  const [cryptoList, setCryptoList] = useState<IRampCryptoItem[]>(cryptoListState);
  const [fiatList, setFiatList] = useState<IRampFiatItem[]>(defaultFiatList);

  const [currency, setCurrency] = useState({
    crypto: cryptoListState.find(
      item => item.symbol === defaultCrypto.symbol && item.network === defaultCrypto.network,
    ),
    fiat: defaultFiatList.find(item => item.symbol === defaultFiat.symbol && item.country === defaultFiat.country),
  });
  const currencyRef = useRef(currency);
  currencyRef.current = currency;
  const crypto = useMemo(() => currency.crypto, [currency]);
  const fiat = useMemo(() => currency.fiat, [currency]);

  const checkManagerSyncState = useCheckManagerSyncState();
  useFetchTxFee();
  const { ach: achFee } = useGetTxFee(MAIN_CHAIN_ID);

  const [amount, setAmount] = useState<string>(defaultCrypto.amount);
  const [amountLocalError, setAmountLocalError] = useState<ErrorType>(INIT_NONE_ERROR);

  const chainInfo = useCurrentChain(MAIN_CHAIN_ID);
  const pin = usePin();
  const wallet = useCurrentWalletInfo();

  const refreshList = useCallback(async () => {
    Loading.show();
    try {
      const { sellDefaultCrypto, sellCryptoList, sellDefaultFiatList, sellDefaultFiat } = await refreshSellCrypto();
      Loading.hide();
      setCryptoList(sellCryptoList);
      setFiatList(sellDefaultFiatList);
      const _fiat = sellDefaultFiatList.find(
        item => item.symbol === sellDefaultFiat.symbol && item.country === sellDefaultFiat.country,
      );
      const _crypto = sellCryptoList.find(
        item => item.symbol === sellDefaultCrypto.symbol && item.network === sellDefaultCrypto.network,
      );

      setAmount(sellDefaultCrypto.amount);
      setCurrency({
        crypto: _crypto,
        fiat: _fiat,
      });
    } catch (error) {
      Loading.hide();
      console.log('error', error);
    }
  }, [refreshSellCrypto]);
  useEffectOnce(() => {
    if (cryptoListState.length === 0 || defaultFiatList.length === 0) {
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

  const onCryptoChange = useCallback(async (_crypto: IRampCryptoItem) => {
    try {
      const { sellFiatList: _fiatList, sellDefaultFiat: _defaultFiat } = await getSellFiat({
        crypto: _crypto.symbol,
        network: _crypto.network,
      });
      setFiatList(_fiatList);
      setCurrency({
        crypto: _crypto,
        fiat: _fiatList.find(item => item.symbol === _defaultFiat.symbol && item.country === _defaultFiat.country),
      });
    } catch (error) {
      console.log('onCryptoChange', error);
    }
  }, []);

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

  return (
    <View style={styles.formContainer}>
      <View>
        <CommonInput
          label={'I want to sell'}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          value={amount}
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
          maxLength={14}
          autoCorrect={false}
          keyboardType="decimal-pad"
          onChangeText={onAmountInput}
          errorStyle={amountError.isWarning && FontStyles.font6}
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
                  // elf token icon is fixed , only use white background color
                  svgName={fiat?.symbol === defaultToken.symbol ? 'testnet' : undefined}
                  imageUrl={fiat?.icon}
                />
              )}
              <TextL style={[GStyles.flex1, fonts.mediumFont]}>{fiat?.symbol || ''}</TextL>
              <Svg size={16} icon="down-arrow" color={defaultColors.icon1} />
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
    height: '100%',
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
