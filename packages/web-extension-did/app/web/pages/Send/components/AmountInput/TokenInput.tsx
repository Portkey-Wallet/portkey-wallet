import { ZERO } from '@portkey-wallet/constants/misc';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { Button, Input } from 'antd';
import clsx from 'clsx';
import { handleKeyDown } from 'pages/Send/utils/util.keyDown';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ChainId } from '@portkey-wallet/types';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { useAmountInUsdShow, useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useCheckManagerSyncState } from 'hooks/wallet';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';

export default function TokenInput({
  fromAccount,
  token,
  value,
  errorMsg,
  onChange,
  getTranslationInfo,
  setErrorMsg,
}: {
  fromAccount: { address: string; AESEncryptPrivateKey: string };
  toAccount: { address: string };
  token: BaseToken;
  value: string;
  errorMsg: string;
  onChange: (params: { amount: string; balance: string }) => void;
  getTranslationInfo: (num: string) => any;
  setErrorMsg: (v: string) => void;
}) {
  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain(token.chainId as ChainId);
  const isMainnet = useIsMainnet();
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>(value ? `${value} ${token.symbol}` : '');
  const [balance, setBalance] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState('');
  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const amountInUsdShow = useAmountInUsdShow();
  const checkManagerSyncState = useCheckManagerSyncState();
  const [isManagerSynced, setIsManagerSynced] = useState(true);
  const { max: maxFee } = useGetTxFee(token.chainId);
  const defaultToken = useDefaultToken(token.chainId);
  const amountInUsd = useMemo(
    () => amountInUsdShow(value || amount, 0, token.symbol),
    [amount, amountInUsdShow, token.symbol, value],
  );

  useEffect(() => {
    getTokenPrice(token.symbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTokenBalance = useCallback(async () => {
    if (!currentChain) return;
    const result = await getBalance({
      rpcUrl: currentChain.endPoint,
      address: token.address,
      chainType: currentNetwork.walletType,
      paramsOption: {
        owner: fromAccount.address,
        symbol: token.symbol,
      },
    });
    const balance = result.result.balance;
    setBalance(balance);
    console.log(result, currentChain, 'balances==getTokenBalance=');
  }, [currentChain, currentNetwork.walletType, fromAccount.address, token.address, token.symbol]);

  const getMaxAmount = useCallback(async () => {
    if (!balance) {
      setMaxAmount('0');
      return;
    }
    if (token.symbol === defaultToken.symbol) {
      if (ZERO.plus(divDecimals(balance, token.decimals)).isLessThanOrEqualTo(maxFee)) {
        setMaxAmount(divDecimals(balance, token.decimals).toString());
        return;
      }
      const _isManagerSynced = await checkManagerSyncState(token.chainId);
      setIsManagerSynced(_isManagerSynced);
      if (!_isManagerSynced) return;
      const fee = await getTranslationInfo(divDecimals(balance, token.decimals).toString());
      if (fee) {
        setMaxAmount(divDecimals(balance, token.decimals).toString());
      } else {
        setMaxAmount(ZERO.plus(divDecimals(balance, token.decimals)).minus(maxFee).toString());
      }
    } else {
      setMaxAmount(divDecimals(balance, token.decimals).toString());
    }
  }, [
    balance,
    checkManagerSyncState,
    defaultToken.symbol,
    getTranslationInfo,
    maxFee,
    token.chainId,
    token.decimals,
    token.symbol,
  ]);

  useEffect(() => {
    getTokenBalance();
    getMaxAmount();
  }, [getMaxAmount, getTokenBalance]);

  const handleAmountBlur = useCallback(() => {
    // setAmount((v) => {
    // const reg = new RegExp(`.+\\.\\d{0,${token?.decimals || 8}}|.+`);
    // const valueProcessed = v
    //   ?.replace(/\.+$/, '')
    //   .replace(/^0+\./, '0.')
    //   .replace(/^0+/, '')
    //   .replace(/^\.+/, '0.')
    //   .match(reg)
    //   ?.toString();
    // const valueString = valueProcessed ? `${parseInputChange(valueProcessed, ZERO, token?.decimals) || 0}` : '';
    // onChange(valueString);

    // return valueString.length ? `${valueString} ${token.symbol}` : '';
    // });
    onChange({ amount, balance });
  }, [amount, balance, onChange]);

  const handleMax = useCallback(async () => {
    const _isManagerSynced = await checkManagerSyncState(token.chainId);
    setIsManagerSynced(_isManagerSynced);
    if (_isManagerSynced) {
      setAmount(maxAmount);
      onChange({ amount: maxAmount, balance });
      setErrorMsg('');
    } else {
      setErrorMsg('Synchronizing on-chain account information...');
    }
  }, [balance, checkManagerSyncState, maxAmount, onChange, setErrorMsg, token.chainId]);

  return (
    <div className="amount-wrap">
      <div className="item asset">
        <span className="label">{t('Asset_with_colon')}</span>
        <div className="control">
          <div className="asset-selector">
            <div className="icon">
              <TokenImageDisplay symbol={token.symbol} src={token.imageUrl} width={36} />
            </div>
            <div className="center">
              <p className="symbol">{token?.symbol}</p>
              <p className="amount">{`${t('Balance_with_colon')} ${formatAmountShow(
                divDecimals(balance, token.decimals),
              )} ${token?.symbol}`}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="item amount">
        <div className="label">
          <div>{t('Amount_with_colon')}</div>
          <Button onClick={handleMax}>Max</Button>
        </div>
        <div className="control">
          <div className="amount-input">
            <Input
              type="text"
              placeholder={`0`}
              className={clsx(isMainnet && token.symbol === defaultToken.symbol && 'need-convert')}
              value={amount}
              maxLength={18}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setAmount((v) => v?.replace(` ${token?.symbol}`, ''));
              }}
              onBlur={handleAmountBlur}
              onChange={(e) => {
                setAmount(e.target.value);
                onChange({ amount: e.target.value, balance });
              }}
            />
            {isMainnet && <span className="convert">{amountInUsd}</span>}
          </div>
        </div>
      </div>
      {errorMsg && <span className={clsx([!isManagerSynced && 'error-warning', 'error-msg'])}>{errorMsg}</span>}
    </div>
  );
}
