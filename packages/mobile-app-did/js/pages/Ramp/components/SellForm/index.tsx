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

import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { ErrorType } from 'types/common';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';
import Loading from 'components/Loading';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { useReceive } from '../../hooks';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { getManagerAccount } from 'utils/redux';
import { getELFChainBalance } from '@portkey-wallet/utils/balance';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ZERO } from '@portkey-wallet/constants/misc';
import CommonToast from 'components/CommonToast';
import { useCheckManagerSyncState } from 'hooks/wallet';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { useAppBuyButtonShow } from 'hooks/cms';
import { useSellCrypto } from '@portkey-wallet/hooks/hooks-ca/ramp';
import { IRampCryptoItem, IRampFiatItem, RampType } from '@portkey-wallet/ramp';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { IRampLimit } from '@portkey-wallet/types/types-ca/ramp';
import isEqual from 'lodash/isEqual';
import { getSellLimit } from '@portkey-wallet/utils/ramp';
import CommonAvatar from 'components/CommonAvatar';
import { ChainId } from '@portkey-wallet/types';

export default function SellForm() {
  const {
    sellCryptoList: cryptoListState,
    sellDefaultCrypto: defaultCrypto,
    sellDefaultFiatList: defaultFiatList,
    sellDefaultFiat: defaultFiat,
    refreshSellCrypto,
  } = useSellCrypto();

  const { refreshBuyButton } = useAppBuyButtonShow();

  const [cryptoList, setCryptoList] = useState<IRampCryptoItem[]>(cryptoListState);
  const [crypto, setCrypto] = useState<IRampCryptoItem | undefined>(
    cryptoList.find(item => item.symbol === defaultCrypto.symbol && item.network === defaultCrypto.network),
  );
  const cryptoRef = useRef<IRampCryptoItem | undefined>(crypto);
  cryptoRef.current = crypto;

  const [fiatList, setFiatList] = useState<IRampFiatItem[]>(defaultFiatList);
  const [fiat, setFiat] = useState<IRampFiatItem | undefined>(
    defaultFiatList.find(item => item.symbol === defaultFiat.symbol && item.country === defaultFiat.country),
  );
  const fiatRef = useRef<IRampFiatItem | undefined>(fiat);
  fiatRef.current = fiat;

  const checkManagerSyncState = useCheckManagerSyncState();
  useFetchTxFee();
  // TODO: useGetTxFee input
  const { ach: achFee } = useGetTxFee('AELF');

  const [amount, setAmount] = useState<string>(defaultCrypto.amount);
  const [amountLocalError, setAmountLocalError] = useState<ErrorType>(INIT_NONE_ERROR);

  const chainInfo = useCurrentChain('AELF');
  const pin = usePin();
  const wallet = useCurrentWalletInfo();

  const refreshList = useCallback(async () => {
    try {
      const { sellDefaultCrypto, sellCryptoList, sellDefaultFiatList, sellDefaultFiat } = await refreshSellCrypto();
      setCryptoList(sellCryptoList);
      setFiatList(sellDefaultFiatList);
      const _fiat = sellDefaultFiatList.find(
        item => item.symbol === sellDefaultFiat.symbol && item.country === sellDefaultFiat.country,
      );
      const _crypto = sellCryptoList.find(
        item => item.symbol === sellDefaultCrypto.symbol && item.network === sellDefaultCrypto.network,
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
  }, [refreshSellCrypto]);
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
      const limitResult = await getSellLimit({
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
  }, [crypto, fiat]);

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
    const arr = text.split('.');
    if (arr[1]?.length > 8) return;
    if (arr.join('').length > 13) return;
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
          crypto?.symbol || ''
        }`,
      });
      return;
    }
    let _rate = rate,
      _receiveAmount = receiveAmount;

    const { address: tokenContractAddress, decimals, symbol, network } = crypto || {};
    const chainId: ChainId = ((network || '').split('-')[1] || 'AELF') as ChainId;
    const { endPoint } = chainInfo || {};
    if (!tokenContractAddress || decimals === undefined || !symbol || !chainId) return;
    if (!pin || !endPoint) return;

    Loading.show();
    let isSellSectionShow = false;
    try {
      const result = await refreshBuyButton();
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
      Loading.show();
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
        _receiveAmount = rst.receiveAmount;
      }
    } catch (error) {
      setAmountLocalError({ ...INIT_HAS_ERROR, errorMsg: 'Insufficient funds' });
      console.log('error', error);
      return;
    } finally {
      Loading.hide();
    }

    navigationService.navigate('RampPreview', {
      amount,
      fiat,
      crypto,
      type: RampType.SELL,
      receiveAmount: _receiveAmount,
      rate: _rate,
    });
  }, [
    amount,
    rate,
    receiveAmount,
    crypto,
    chainInfo,
    pin,
    fiat,
    refreshBuyButton,
    checkManagerSyncState,
    achFee,
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
                  callBack: setFiat,
                });
              }}>
              {fiat?.icon && (
                <CommonAvatar hasBorder title={fiat?.symbol || ''} style={styles.unitIconStyle} imageUrl={fiat?.icon} />
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
