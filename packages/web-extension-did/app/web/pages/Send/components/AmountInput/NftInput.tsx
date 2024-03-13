import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { Input } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ChainId } from '@portkey-wallet/types';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { getSeedTypeTag } from 'utils/assets';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import CustomSvg from 'components/CustomSvg';

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
  const [amount, setAmount] = useState<string>(value);
  const currentChain = useCurrentChain(token.chainId as ChainId);
  const currentNetwork = useCurrentNetworkInfo();
  const [balance, setBalance] = useState<string>('');
  const seedTypeTag = useMemo(() => getSeedTypeTag(token), [token]);

  const handleAmountBlur = useCallback(() => {
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
        <div className="avatar flex-center">
          {seedTypeTag && <CustomSvg type={seedTypeTag} />}
          {token.imageUrl ? <img src={token.imageUrl} /> : <p>{token.symbol[0]}</p>}
        </div>
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
              placeholder={`0`}
              value={amount}
              onBlur={handleAmountBlur}
              onChange={(e) => {
                const _v = parseInputNumberChange(e.target.value, undefined, token.decimals);
                setAmount(_v);
                onChange({ amount: _v, balance });
              }}
            />
          </div>
        </div>
      </div>
      {errorMsg && <span className="error-msg">{errorMsg}</span>}
    </div>
  );
}
