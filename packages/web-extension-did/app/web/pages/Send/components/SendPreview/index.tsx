import { ZERO } from '@portkey-wallet/constants/misc';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
// import { useTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import './index.less';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { CROSS_FEE } from '@portkey-wallet/constants/constants-ca/wallet';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { getEntireDIDAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import { ChainId } from '@portkey-wallet/types';
import { chainShowText } from '@portkey-wallet/utils';
import { useAmountInUsdShow, useFreshTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useIsTestnet } from 'hooks/useNetwork';

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
  const { walletName } = useWalletInfo();
  const wallet = useCurrentWalletInfo();
  const isTestNet = useIsTestnet();
  const amountInUsdShow = useAmountInUsdShow();
  useFreshTokenPrice();

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
    if (ZERO.plus(amount).isLessThanOrEqualTo(ZERO.plus(CROSS_FEE))) {
      return (
        <>
          <span className="usd">{!isTestNet && '$0'}</span>0
        </>
      );
    } else {
      return (
        <>
          <span className="usd">
            {!isTestNet && amountInUsdShow(ZERO.plus(amount).minus(ZERO.plus(CROSS_FEE)).toString(), 0, symbol)}
          </span>
          {formatAmountShow(ZERO.plus(amount).minus(ZERO.plus(CROSS_FEE)))}
        </>
      );
    }
  }, [amount, amountInUsdShow, isTestNet, symbol]);

  return (
    <div className="send-preview">
      {type !== 'nft' ? (
        <div className="amount-preview">
          <p className="amount">
            -{formatAmountShow(amount)} {symbol}
          </p>
          <p className="convert">{!isTestNet && amountInUsdShow(amount, 0, symbol)}</p>
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
            <p className="name">{walletName}</p>
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
            <span className="usd">{!isTestNet && amountInUsdShow(transactionFee, 0, 'ELF')}</span>
            {` ${formatAmountShow(transactionFee)} ELF`}
          </span>
        </p>
      </div>
      {isCross && symbol === 'ELF' && (
        <>
          <div className="fee-preview">
            <span className="label">Cross-chain Transaction fee</span>
            <p className="value">
              <span className="symbol">
                <span className="usd">{!isTestNet && amountInUsdShow(CROSS_FEE, 0, symbol)}</span>
                {` ${formatAmountShow(CROSS_FEE)} ELF`}
              </span>
            </p>
          </div>
          <div className="fee-preview">
            <span className="label">Estimated amount received</span>
            <p className="value">
              <span className="symbol">{renderEstimateAmount}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
