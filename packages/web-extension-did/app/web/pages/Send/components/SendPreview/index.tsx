import { ZERO } from '@portkey-wallet/constants/misc';
import clsx from 'clsx';
import { useMemo } from 'react';
// import { useTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import './index.less';
import { useCurrentUserInfo, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { formatAmountShow, formatAmountUSDShow } from '@portkey-wallet/utils/converter';
import { getEntireDIDAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import { ChainId } from '@portkey-wallet/types';
import { chainShowText } from '@portkey-wallet/utils';
import { useAmountInUsdShow, useFreshTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { getSeedTypeTag } from 'utils/assets';
import { SeedTypeEnum } from '@portkey-wallet/types/types-ca/assets';
import CustomSvg from 'components/CustomSvg';
import { CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL } from '@portkey-wallet/utils/withdraw';

export interface ISendPreviewProps {
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
  isSeed?: boolean;
  seedType?: SeedTypeEnum;
  decimals?: number;
  receiveAmount?: string;
  receiveAmountUsd?: string;
  label?: string;
  crossChainFee: number | string;
  crossChainFeeUnit?: string;
}

export default function SendPreview(props: ISendPreviewProps) {
  const userInfo = useCurrentUserInfo();
  const {
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
    decimals,
    receiveAmount,
    receiveAmountUsd,
    label,
    crossChainFee,
    crossChainFeeUnit,
  } = props;
  const wallet = useCurrentWalletInfo();
  const isMainnet = useIsMainnet();
  const amountInUsdShow = useAmountInUsdShow();
  useFreshTokenPrice();
  const defaultToken = useDefaultToken(chainId);
  const seedTypeTag = useMemo(() => getSeedTypeTag(props), [props]);

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

  const isSupportCross = useMemo(
    () => Boolean(receiveAmount) && CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(symbol),
    [receiveAmount, symbol],
  );

  const receiveAmountInner = useMemo(() => {
    let _amount = amount;
    let amountUsd;
    if (receiveAmount) _amount = receiveAmount;
    else _amount = formatAmountShow(ZERO.plus(_amount).minus(crossChainFee), Number(defaultToken.decimals));

    if (receiveAmountUsd) amountUsd = formatAmountUSDShow(receiveAmountUsd);
    else amountUsd = amountInUsdShow(ZERO.plus(_amount).minus(crossChainFee).toFixed(), 0, symbol);

    return (
      <>
        <div className="amount">{`${_amount} ${label ?? symbol}`}</div>
        <div className="usd">{isMainnet && amountUsd}</div>
      </>
    );
  }, [
    amount,
    amountInUsdShow,
    crossChainFee,
    defaultToken.decimals,
    isMainnet,
    label,
    receiveAmount,
    receiveAmountUsd,
    symbol,
  ]);

  const renderEstimateAmount = useMemo(() => {
    if (ZERO.plus(amount).isLessThanOrEqualTo(crossChainFee) && symbol === defaultToken.symbol) {
      return (
        <>
          <div className="amount">{`0 ${label ?? symbol}`}</div>
          <div className="usd">{isMainnet && '$ 0'}</div>
        </>
      );
    } else {
      return receiveAmountInner;
    }
  }, [amount, crossChainFee, defaultToken.symbol, isMainnet, label, receiveAmountInner, symbol]);

  return (
    <div className="send-preview">
      {type !== 'nft' ? (
        <div className="amount-preview">
          <p className="amount">
            -{formatAmountShow(amount, decimals)} {label ?? symbol}
          </p>
          <p className="convert">{isMainnet && amountInUsdShow(amount, 0, symbol)}</p>
        </div>
      ) : (
        <div className="amount-preview nft">
          <div className="avatar flex-center">
            {seedTypeTag && <CustomSvg type={seedTypeTag} />}
            {imageUrl ? <img src={imageUrl} /> : <p>{symbol?.slice(0, 1)}</p>}
          </div>
          <div className="info">
            <div className="index flex">
              <p className="alias">{alias}</p>
              <p className="token-id">{`#${tokenId}`}</p>
            </div>
            <p className="quantity">
              Amount: <span>{formatAmountShow(amount, decimals)}</span>
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
      <div className="fee-preview flex-between">
        <span className="label">Transaction fee</span>
        <div className="value flex-column">
          <div className="amount">{`${formatAmountShow(transactionFee, Number(defaultToken.decimals))} ${
            defaultToken.symbol
          }`}</div>
          <div className="usd">{isMainnet && amountInUsdShow(transactionFee, 0, defaultToken.symbol)}</div>
        </div>
      </div>
      {isCross && (
        <div className="fee-preview flex-between">
          <span className="label">Estimated CrossChain Transfer</span>
          <div className="value flex-column">
            <div className="amount">
              {isSupportCross
                ? `${crossChainFee} ${crossChainFeeUnit}`
                : `${formatAmountShow(crossChainFee, Number(defaultToken.decimals))} ${defaultToken.symbol}`}
            </div>
            <div className="usd">
              {isMainnet &&
                amountInUsdShow(
                  crossChainFee,
                  0,
                  isSupportCross && crossChainFeeUnit ? crossChainFeeUnit : defaultToken.symbol,
                )}
            </div>
          </div>
        </div>
      )}
      {isCross && (isSupportCross || symbol === defaultToken.symbol) && (
        <div className="fee-preview flex-between">
          <span className="label">Estimated amount received</span>
          <div className="value flex-column">{renderEstimateAmount}</div>
        </div>
      )}
    </div>
  );
}
