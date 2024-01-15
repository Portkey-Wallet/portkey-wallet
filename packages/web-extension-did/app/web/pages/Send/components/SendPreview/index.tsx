import { ZERO } from '@portkey-wallet/constants/misc';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
// import { useTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import './index.less';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { getEntireDIDAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import { ChainId } from '@portkey-wallet/types';
import { chainShowText } from '@portkey-wallet/utils';
import { useAmountInUsdShow, useFreshTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

export default function SendPreview({
  amount,
  symbol,
  alias,
  toAccount,
  transactionFee,
  type,
  imageUrl,
  chainId,
  isCross,
  tokenId,
}: {
  amount: string;
  symbol: string;
  alias: string;
  imageUrl: string;
  toAccount: { name?: string; address: string };
  transactionFee: string | number;
  type: 'nft' | 'token';
  chainId: ChainId;
  isCross: boolean;
  tokenId: string;
}) {
  const { userInfo } = useWalletInfo();
  const wallet = useCurrentWalletInfo();
  const isMainnet = useIsMainnet();
  const amountInUsdShow = useAmountInUsdShow();
  useFreshTokenPrice();
  const { crossChain: crossChainFee } = useGetTxFee(chainId);
  const defaultToken = useDefaultToken(chainId);

  const toChain = useMemo(() => {
    const arr = toAccount.address.split('_');
    if (isAelfAddress(arr[arr.length - 1])) {
      return 'AELF';
    }
    return arr[arr.length - 1];
  }, [toAccount.address]);
  const entireFromAddressShow = useMemo(
    () => getEntireDIDAelfAddress(wallet?.[chainId]?.caAddress || '', undefined, chainId),
    [chainId, wallet],
  );
  const renderEstimateAmount = useMemo(() => {
    if (ZERO.plus(amount).isLessThanOrEqualTo(crossChainFee)) {
      return (
        <>
          <span className="usd">{isMainnet && '$0'}</span>
          {`0 ${symbol}`}
        </>
      );
    } else {
      return (
        <>
          <span className="usd">
            {isMainnet && amountInUsdShow(ZERO.plus(amount).minus(crossChainFee).toFixed(), 0, symbol)}
          </span>
          {`${formatAmountShow(ZERO.plus(amount).minus(crossChainFee), Number(defaultToken.decimals))} ${symbol}`}
        </>
      );
    }
  }, [amount, amountInUsdShow, crossChainFee, defaultToken.decimals, isMainnet, symbol]);

  return (
    <div className="send-preview">
      {type !== 'nft' ? (
        <div className="amount-preview">
          <p className="amount">
            -{formatAmountShow(amount)} {symbol}
          </p>
          <p className="convert">{isMainnet && amountInUsdShow(amount, 0, symbol)}</p>
        </div>
      ) : (
        <div className="amount-preview nft">
          <div className="avatar">{imageUrl ? <img src={imageUrl} /> : <p>{symbol?.slice(0, 1)}</p>}</div>
          <div className="info">
            <p className="index flex">
              <p className="alias">{alias}</p>
              <p className="token-id">{`#${tokenId}`}</p>
            </p>
            <p className="quantity">
              Amount: <span>{formatAmountShow(amount)}</span>
            </p>
          </div>
        </div>
      )}
      <div className="address-preview">
        <div className="item">
          <span className="label">From</span>
          <div className="value">
            <p className="name">{userInfo?.nickName}</p>
            <p className="address">{entireFromAddressShow.replace(/(?<=^\w{9})\w+(?=\w{10})/, '...')}</p>
          </div>
        </div>
        <div className={clsx('item', toAccount.name?.length || 'no-name')}>
          <span className="label">To</span>
          <div className="value">
            {!!toAccount.name?.length && <p className="name">{toAccount.name}</p>}
            <p className="address">
              {toAccount.address.includes('ELF_')
                ? toAccount.address.replace(/(?<=^\w{9})\w+(?=\w{10})/, '...')
                : toAccount.address.replace(/(?<=^\w{6})\w+(?=\w{6})/, '...')}
            </p>
          </div>
        </div>
        <div className="item network">
          <span>Network</span>
          <div>
            <p className="chain">
              {`${chainShowText(chainId as ChainId)} ${chainId}->${chainShowText(toChain as ChainId)} ${toChain}`}
            </p>
          </div>
        </div>
      </div>
      <div className="fee-preview">
        <span className="label">Transaction fee</span>
        <p className="value">
          <span className="symbol">
            <span className="usd">{isMainnet && amountInUsdShow(transactionFee, 0, defaultToken.symbol)}</span>
            {` ${formatAmountShow(transactionFee, Number(defaultToken.decimals))} ${defaultToken.symbol}`}
          </span>
        </p>
      </div>
      {isCross && (
        <div className="fee-preview">
          <span className="label">Estimated CrossChain Transfer</span>
          <p className="value">
            <span className="symbol">
              <span className="usd">{isMainnet && amountInUsdShow(crossChainFee, 0, defaultToken.symbol)}</span>
              {` ${formatAmountShow(crossChainFee, Number(defaultToken.decimals))} ${defaultToken.symbol}`}
            </span>
          </p>
        </div>
      )}
      {isCross && symbol === defaultToken.symbol && (
        <div className="fee-preview">
          <span className="label">Estimated amount received</span>
          <p className="value">
            <span className="symbol">{renderEstimateAmount}</span>
          </p>
        </div>
      )}
    </div>
  );
}
