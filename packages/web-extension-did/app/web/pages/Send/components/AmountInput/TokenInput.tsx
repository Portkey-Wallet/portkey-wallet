import { ZERO } from '@portkey-wallet/constants/misc';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { divDecimals, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { Button, Input } from 'antd';
import clsx from 'clsx';
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
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import { useEffectOnce } from '@portkey-wallet/hooks';
import CircleLoading from 'components/CircleLoading';

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
  const [balanceLoading, setBalanceLoading] = useState(false);
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
  const needConvert = useMemo(() => isMainnet && amountInUsd, [amountInUsd, isMainnet]);
  useEffectOnce(() => {
    getTokenPrice(token.symbol);
  });

  const getTokenBalance = useCallback(async () => {
    if (!currentChain) return;
    try {
      setBalanceLoading(true);
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
    } catch (error) {
      console.log('===getBalance error', error);
    } finally {
      setBalanceLoading(false);
    }
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
              <p className="amount flex-row-center">
                {t('Balance_with_colon')}
                {balanceLoading ? (
                  <CircleLoading />
                ) : (
                  ` ${formatTokenAmountShowWithDecimals(balance, token.decimals)} ${token?.symbol}`
                )}
              </p>
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
          <div className={clsx('amount-input', needConvert ? 'need-convert' : '')}>
            <Input
              type="text"
              placeholder={`0`}
              className={clsx(needConvert ? 'need-convert' : '')}
              value={amount}
              onFocus={() => {
                setAmount((v) => v?.replace(` ${token?.symbol}`, ''));
              }}
              onBlur={handleAmountBlur}
              onChange={(e) => {
                const _v = parseInputNumberChange(e.target.value, undefined, token.decimals);
                setAmount(_v);
                onChange({ amount: _v, balance });
              }}
            />
            {needConvert && <span className="convert">{amountInUsd}</span>}
          </div>
        </div>
      </div>
      {errorMsg && <span className={clsx([!isManagerSynced && 'error-warning', 'error-msg'])}>{errorMsg}</span>}
    </div>
  );
}
