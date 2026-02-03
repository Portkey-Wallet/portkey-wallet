import { ToAccount } from 'pages/Send';
import clsx from 'clsx';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import {
  formatAmountShow,
  formatAmountUSDShow,
  formatStr2EllipsisStr,
  unitConverter,
} from '@portkey-wallet/utils/converter';
import { BaseToken } from '@portkey-wallet/types/types-eoa/token';
import { ChainId } from '@portkey-wallet/types';
import { ZERO } from '@portkey-wallet/constants/misc';
import { isDIDAelfAddress } from '@portkey-wallet/utils/aelf';
import { useCurrentChainList, useDefaultToken } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import { useMemo } from 'react';
import { getAddressChainId } from '@portkey-wallet/utils';
import { INetworkItem } from '../SelectNetwork';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { TransferType } from '@portkey-wallet/types/types-eoa/routeParams';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';
import { getEstimatedTime } from 'pages/Send/utils';
import { CommonModalTip } from '@portkey/did-ui-react';
import { useAmountInUsdShow, useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-eoa/useTokensPrice';
import { useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import './index.less';

export interface ISendPreviewProps {
  amount?: string;
  usdAmount?: string;
  toAccount: ToAccount;
  chainId: ChainId;
  className?: string;
  tokenInfo: BaseToken;
  targetNetwork?: INetworkItem;
  transferType: TransferType;
  eBridgeFeeNotEnough?: boolean;
  transactionFee?: string;
  transactionUnit?: string;
  networkFee?: string;
  networkFeeUnit?: string;
  receiveAmount?: string;
  receiveAmountUsd?: string;
  seedType?: string;
  isSeed?: boolean;
}

export default function SendPreview({
  toAccount,
  chainId = 'AELF',
  className,
  tokenInfo,
  amount = '',
  usdAmount,
  targetNetwork,
  transferType,
  eBridgeFeeNotEnough,
  transactionFee = '',
  transactionUnit = '',
  networkFee = '',
  networkFeeUnit = '',
  receiveAmount = '',
  receiveAmountUsd = '',
}: ISendPreviewProps) {
  console.log(toAccount);
  const chainList = useCurrentChainList();
  const isMainnet = useIsMainnet();
  const toChainId = useMemo(
    () => getAddressChainId(toAccount.address, chainId) || 'AELF',
    [chainId, toAccount.address],
  );
  const aelfChainImg = useMemo(
    () => chainList?.find((ele) => ele.chainId === toChainId)?.chainImageUrl,
    [chainList, toChainId],
  );
  const amountInUsdShow = useAmountInUsdShow();
  const { crossChain: crossDefaultFee } = useGetTxFee(tokenInfo.chainId);
  const defaultToken = useDefaultToken();
  const [tokenPriceObject] = useGetCurrentAccountTokenPrice();
  const EstimateAmount = useMemo(() => {
    let _amount = amount;

    // [DEPRECATED-ETRANSFER] BEGIN - E_TRANSFER check removed
    // // adjust etransfer
    // if (
    //   ZERO.plus(amount).isLessThanOrEqualTo(transactionFee || '') &&
    //   tokenInfo?.symbol === 'ELF' &&
    //   transferType === TransferType.E_TRANSFER
    // ) {
    //   return {
    //     estimateAmount: `0 ${tokenInfo?.label || tokenInfo?.symbol}`,
    //     estimateAmountUsd: isMainnet ? '$0' : '',
    //   };
    // }
    // [DEPRECATED-ETRANSFER] END

    // adjust ebridge (E_TRANSFER removed)
    if (transferType === TransferType.E_BRIDGE) {
      return {
        estimateAmount: `${receiveAmount} ${tokenInfo?.label || tokenInfo?.symbol}`,
        estimateAmountUsd: isMainnet ? receiveAmountUsd : '',
      };
    }

    // adjust general transfer
    if (transferType === TransferType.GENERAL_SAME_CHAIN) {
      _amount = formatAmountShow(_amount, Number(tokenInfo.decimals));
      const amountUsd = amountInUsdShow(_amount, 0, tokenInfo.symbol);

      console.log('GENERAL_SAME_CHAIN', _amount, amountUsd);

      return {
        estimateAmount: `${_amount} ${tokenInfo.label || tokenInfo.symbol}`,
        estimateAmountUsd: isMainnet ? amountUsd : '',
      };
    }

    //
    const fee = networkFee || 0;
    if (ZERO.plus(amount).isLessThanOrEqualTo(fee) && tokenInfo.symbol === defaultToken.symbol) {
      return {
        estimateAmount: `0 ${tokenInfo?.label || tokenInfo?.symbol}`,
        estimateAmountUsd: isMainnet ? '$0' : '',
      };
    }

    // adjust cross chain in aelf
    if (transferType === TransferType.GENERAL_CROSS_CHAIN) {
      _amount =
        tokenInfo.symbol === defaultToken.symbol
          ? formatAmountShow(
              ZERO.plus(_amount)
                .minus(networkFee || '')
                .minus(crossDefaultFee),
              Number(defaultToken.decimals),
            )
          : formatAmountShow(ZERO.plus(_amount), Number(tokenInfo.decimals));
    } else {
      _amount =
        tokenInfo.symbol === defaultToken.symbol
          ? formatAmountShow(ZERO.plus(_amount).minus(networkFee || ''), Number(defaultToken.decimals))
          : formatAmountShow(ZERO.plus(_amount), Number(tokenInfo.decimals));
    }

    const amountUsd = tokenPriceObject[tokenInfo?.symbol] ? amountInUsdShow(_amount, 0, tokenInfo.symbol) : '';

    return {
      estimateAmount: `${_amount} ${tokenInfo.label || tokenInfo.symbol}`,
      estimateAmountUsd: isMainnet ? amountUsd : '',
    };
  }, [
    amount,
    amountInUsdShow,
    crossDefaultFee,
    defaultToken.decimals,
    defaultToken.symbol,
    isMainnet,
    networkFee,
    receiveAmount,
    receiveAmountUsd,
    tokenInfo.decimals,
    tokenInfo.label,
    tokenInfo.symbol,
    tokenPriceObject,
    transactionFee,
    transferType,
  ]);

  const estimatedTime = useMemo(
    () => (targetNetwork ? getEstimatedTime(targetNetwork, transferType) : ''),
    [targetNetwork, transferType],
  );

  const transactionFeeShow = useMemo(() => {
    const result = {
      feeShow: '',
      feeUsdShow: '',
    };
    switch (transferType) {
      // [DEPRECATED-ETRANSFER] E_TRANSFER case removed
      case TransferType.E_BRIDGE:
        result.feeShow = `${transactionFee} ${transactionUnit}`;
        result.feeUsdShow = `$${unitConverter(
          ZERO.plus(transactionFee || '').multipliedBy(tokenPriceObject[transactionUnit || '']),
        )}`;
        break;
      case TransferType.GENERAL_CROSS_CHAIN:
        result.feeShow = `${unitConverter(crossDefaultFee)} ${defaultToken.symbol}`;
        result.feeUsdShow = `$${unitConverter(
          ZERO.plus(crossDefaultFee).multipliedBy(tokenPriceObject[defaultToken.symbol]),
        )}`;
    }
    return result;
  }, [crossDefaultFee, defaultToken.symbol, tokenPriceObject, transactionFee, transactionUnit, transferType]);

  return (
    <div className={clsx('send-preview-wrap', className)}>
      <div className="flex-column-center icon-amount">
        <CustomSvgV3 type="Activity=Send" className="activity-send-icon" />
        <div className="amount-show">{`${formatAmountShow(amount, tokenInfo?.decimals)} ${tokenInfo?.symbol}`}</div>
        {isMainnet && <div className="usd-show">{`${formatAmountUSDShow(usdAmount)}`}</div>}
      </div>
      <div className="flex-between-center content-row-info">
        <div>{`To`}</div>
        <div className="value-show">{formatStr2EllipsisStr(toAccount.address, [8, 8])}</div>
      </div>
      <div className="flex-between-center content-row-info">
        <div>{`Destination network`}</div>
        <div className="value-show flex-row-center gap-4">
          <>
            <img
              src={isDIDAelfAddress(toAccount.address) ? aelfChainImg : targetNetwork?.imageUrl}
              className="chain-image"
            />
            {isDIDAelfAddress(toAccount.address)
              ? `aelf ${toChainId === MAIN_CHAIN_ID ? 'MainChain' : 'dAppChain'}`
              : targetNetwork?.name}
          </>
        </div>
      </div>
      {!!transactionFeeShow.feeShow && (
        <div className="flex-between-center content-row-info">
          <div>
            <div className="flex-row-center gap-4">
              {`Transaction fee`}
              <CommonModalTip
                title="Transaction fee"
                content="Fee applied by the cross-chain bridge to process your transaction on blockchains."
              />
            </div>
            {eBridgeFeeNotEnough && <div className="below-show text-color-danger">{`Not enough ELF`}</div>}
          </div>
          <div className="value-show">
            <div>{`${transactionFeeShow.feeShow}`}</div>
            {isMainnet && <div className="below-show">{transactionFeeShow.feeUsdShow}</div>}
          </div>
        </div>
      )}
      {!!networkFee && (
        <div className="flex-between-center content-row-info">
          <div className="flex-row-center gap-4">
            {`Estimated network fee`}
            <CommonModalTip
              title="Estimated network fee"
              content="Fee applied by the blockchain to process your transaction, also known as gas fee."
            />
          </div>
          <div className="value-show">
            <div>{`${networkFee} ${networkFeeUnit}`}</div>
            {isMainnet && (
              <div className="below-show">{`$${unitConverter(
                ZERO.plus(networkFee || '').multipliedBy(tokenPriceObject[networkFeeUnit || 'ELF']),
              )}`}</div>
            )}
          </div>
        </div>
      )}
      <div className="flex-between-center content-row-info">
        <div className="flex-row-center gap-4">{`Amount to receive`}</div>
        <div className="value-show">
          <div>{EstimateAmount.estimateAmount}</div>
          {isMainnet && <div className="below-show">{`$${EstimateAmount?.estimateAmountUsd}`}</div>}
        </div>
      </div>
      {!!estimatedTime && (
        <div className="flex-between-center content-row-info">
          <div>{`Estimated duration`}</div>
          <div className="value-show">{`~${estimatedTime}`}</div>
        </div>
      )}
      {/* [DEPRECATED-ETRANSFER] E_TRANSFER powered-by removed, only show eBridge */}
      {transferType === TransferType.E_BRIDGE && (
        <div className="flex-center powered-by">
          <CustomSvgV3 className="provider-ebridge-icon" type="Provider=eBridge" />
        </div>
      )}
    </div>
  );
}
