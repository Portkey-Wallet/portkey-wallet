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
import { usePayment, usePin } from 'hooks/store';
import SelectCurrency from '../SelectCurrency';
import { FiatType } from '@portkey-wallet/store/store-ca/payment/type';

import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { getCryptoList } from '@portkey-wallet/api/api-did/payment/util';
import { ErrorType } from 'types/common';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';
import { CryptoInfoType } from '@portkey-wallet/api/api-did/payment/type';
import { CryptoItemType, LimitType, TypeEnum } from 'pages/Buy/types';
import { INIT_BUY_AMOUNT, tokenList } from 'pages/Buy/constants';
import Loading from 'components/Loading';
import { divDecimals, formatAmountShow, timesDecimals, unitConverter } from '@portkey-wallet/utils/converter';
import { useReceive } from 'pages/Buy/hooks';
import { useAssets } from '@portkey-wallet/hooks/hooks-ca/assets';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { getManagerAccount } from 'utils/redux';
import { getELFChainBalance } from '@portkey-wallet/utils/balance';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { customFetch } from '@portkey-wallet/utils/fetch';
import { ZERO } from '@portkey-wallet/constants/misc';
import { DEFAULT_FEE } from '@portkey-wallet/constants/constants-ca/wallet';

export default function SellForm() {
  const { buyFiatList: fiatList } = usePayment();

  const [fiat, setFiat] = useState<FiatType | undefined>(
    fiatList.find(item => item.currency === 'USD' && item.country === 'US'),
  );
  const [token, setToken] = useState<CryptoItemType>(tokenList[0]);
  const [amount, setAmount] = useState<string>(INIT_BUY_AMOUNT);
  const [amountLocalError, setAmountLocalError] = useState<ErrorType>(INIT_NONE_ERROR);
  const { accountToken } = useAssets();
  const aelfToken = useMemo(
    () => accountToken.accountTokenList.find(item => item.symbol === 'ELF' && item.chainId === 'AELF'),
    [accountToken],
  );
  const chainInfo = useCurrentChain('AELF');
  const pin = usePin();
  const wallet = useCurrentWalletInfo();

  const limitAmountRef = useRef<LimitType>();
  const refreshReceiveRef = useRef<() => void>();
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
      item => item.crypto === token.crypto && item.network === token.network,
    );

    console.log('cryptoInfo', cryptoInfo);

    if (cryptoInfo === undefined || cryptoInfo.minSellAmount === null || cryptoInfo.maxSellAmount === null) {
      limitAmountRef.current = undefined;
      return;
    }

    limitAmountRef.current = {
      min: cryptoInfo.minSellAmount,
      max: cryptoInfo.maxSellAmount,
    };
  }, [fiat, token]);

  const {
    receiveAmount,
    rate,
    rateRefreshTime,
    refreshReceive,
    amountError: amountFetchError,
    isAllowAmount,
  } = useReceive(TypeEnum.SELL, amount, fiat, token, '', '', limitAmountRef, isRefreshReceiveValid);
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
    if (limitAmountRef.current === undefined) return;
    const amountNum = Number(amount);
    const { min, max } = limitAmountRef.current;
    if (amountNum < min || amountNum > max) {
      setAmountLocalError({
        ...INIT_HAS_ERROR,
        errorMsg: `Limit Amount ${formatAmountShow(min)}-${formatAmountShow(max)} ${fiat?.currency}`,
      });
      return;
    }
    let _rate = rate,
      _receiveAmount = receiveAmount;

    const { tokenContractAddress, decimals, symbol, chainId } = aelfToken || {};
    const { caContractAddress, endPoint } = chainInfo || {};
    if (!tokenContractAddress || decimals === undefined || !symbol || !chainId) return;
    if (!pin || !caContractAddress || !endPoint) return;
    if (ZERO.plus(amount).isLessThanOrEqualTo(DEFAULT_FEE)) return;

    try {
      Loading.show();
      const account = getManagerAccount(pin);
      if (!account) return;
      const caContract = await getContractBasic({
        contractAddress: caContractAddress,
        rpcUrl: endPoint,
        account: account,
      });
      const tokenContract = await getContractBasic({
        contractAddress: tokenContractAddress,
        rpcUrl: endPoint,
        account: account,
      });

      const balance = await getELFChainBalance(tokenContract, symbol, wallet?.[chainId]?.caAddress || '');

      if (divDecimals(balance, decimals).isLessThan(amount)) {
        return;
      }

      const raw = await caContract.encodedTx('ManagerForwardCall', {
        caHash: wallet.caHash,
        contractAddress: tokenContractAddress,
        methodName: 'Transfer',
        args: {
          symbol: symbol,
          to: `ELF_2KQWh5v6Y24VcGgsx2KHpQvRyyU5DnCZ4eAUPqGQbnuZgExKaV_AELF`,
          amount: timesDecimals(amount, decimals || '0').toNumber(),
        },
      });

      await customFetch(`${endPoint}/api/blockChain/calculateTransactionFee`, {
        method: 'POST',
        params: {
          RawTransaction: raw,
        },
      });
    } catch (error) {
      // TODO: add Toast
      console.log('error', error);
      return;
    } finally {
      Loading.hide();
    }

    if (isRefreshReceiveValid.current === false) {
      Loading.show();
      const rst = await refreshReceive();
      Loading.hide();
      if (rst === undefined) return;
      _rate = rst.rate;
      _receiveAmount = rst.receiveAmount;
    }

    navigationService.navigate('BuyPreview', {
      amount,
      fiat,
      token,
      type: TypeEnum.SELL,
      receiveAmount: _receiveAmount,
      rate: _rate,
    });
  }, [amount, rate, receiveAmount, aelfToken, chainInfo, pin, fiat, token, wallet, refreshReceive]);

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
          onChangeText={onAmountInput}
          errorMessage={amountError.isError ? amountError.errorMsg : ''}
          // placeholder={t('Enter Phone Number')}
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
