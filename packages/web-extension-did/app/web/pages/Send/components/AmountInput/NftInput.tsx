import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { Input } from 'antd';
import { handleKeyDownInt } from 'pages/Send/utils/util.keyDown';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ChainId } from '@portkey-wallet/types';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';

export default function NftInput({
  fromAccount,
  token,
  value,
  errorMsg,
  onChange,
}: {
  fromAccount: { address: string; AESEncryptPrivateKey: string };
  token: BaseToken;
  value: string;
  errorMsg: string;
  onChange: (params: { amount: string; balance: string }) => void;
}) {
  const { t } = useTranslation();
  // const [errorMsg, setErrorMsg] = useState('Insufficient funds');
  const [amount, setAmount] = useState<string>(value);
  const currentChain = useCurrentChain(token.chainId as ChainId);
  const currentNetwork = useCurrentNetworkInfo();
  // const isMain = useMemo(() => currentNetwork.networkType === 'MAINNET', [currentNetwork]);
  const [balance, setBalance] = useState<string>('');

  const handleAmountBlur = useCallback(() => {
    // setAmount((v) => {
    //   const reg = new RegExp(`.+\\.\\d{0,${token?.decimals || 8}}|.+`);
    //   const valueProcessed = v
    //     ?.replace(/\.+$/, '')
    //     .replace(/^0+\./, '0.')
    //     .replace(/^0+/, '')
    //     .replace(/^\.+/, '0.')
    //     .match(reg)
    //     ?.toString();
    //   const valueString = valueProcessed ? `${parseInputChange(valueProcessed, ZERO, token?.decimals) || 0}` : '';
    //   onChange(valueString);
    //   return valueString.length ? `${valueString}` : '';
    // });
    onChange({ amount, balance });
  }, [amount, balance, onChange]);

  const getTokenBalance = useCallback(async () => {
    if (!currentChain) return;
    const result = await getBalance({
      rpcUrl: currentChain.endPoint,
      address: token?.address,
      chainType: currentNetwork.walletType,
      paramsOption: {
        owner: fromAccount.address,
        symbol: token.symbol,
      },
    });
    const balance = result.result.balance;
    setBalance(balance);
    console.log(result, currentChain, 'balances==getTokenBalance=');
  }, [currentChain, currentNetwork.walletType, fromAccount.address, token]);

  useEffect(() => {
    getTokenBalance();
  }, [getTokenBalance]);

  return (
    <div className="amount-wrap">
      <div className="item asset nft">
        <div className="avatar">{token.imageUrl ? <img src={token.imageUrl} /> : <p>{token.symbol[0]}</p>}</div>
        <div className="info">
          <div className="index">
            <p className="alias">{token.alias}</p>
            <p className="token-id">#{token.tokenId}</p>
          </div>
          <p className="quantity">
            Balance: <span>{`${formatAmountShow(divDecimals(balance, token.decimals))}`}</span>
          </p>
        </div>
      </div>
      <div className="item amount">
        <span className="label">{t('Amount_with_colon')}</span>
        <div className="control">
          <div className="amount-input">
            <Input
              type="text"
              maxLength={18}
              placeholder={`0`}
              value={amount}
              onKeyDown={handleKeyDownInt}
              onBlur={handleAmountBlur}
              onChange={(e) => {
                setAmount(e.target.value);
                onChange({ amount: e.target.value, balance });
              }}
            />
          </div>
        </div>
      </div>
      {errorMsg && <span className="error-msg">{errorMsg}</span>}
    </div>
  );
}
