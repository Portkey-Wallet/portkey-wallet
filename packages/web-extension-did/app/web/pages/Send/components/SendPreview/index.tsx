import { ToAccount } from 'pages/Send';
import clsx from 'clsx';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { formatAmountShow, formatAmountUSDShow, formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { ZERO } from '@portkey-wallet/constants/misc';
import { isDIDAelfAddress } from '@portkey-wallet/utils/aelf';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useMemo } from 'react';
import { getAddressChainId } from '@portkey-wallet/utils';
import { INetworkItem } from '../SelectNetwork';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { TransferType } from '@portkey-wallet/types/types-ca/routeParams';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { getEstimatedTime } from 'pages/Send/utils';
import { CommonModalTip } from '@portkey/did-ui-react';
import './index.less';
export interface ISendPreviewProps {
  amount?: string;
  usdAmount?: string;
  toAccount: ToAccount;
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
}

export default function SendPreview({
  toAccount,
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
  const toChainId = useMemo(() => getAddressChainId(toAccount.address, 'AELF') || 'AELF', [toAccount.address]);
  const aelfChainImg = useMemo(
    () => chainList?.find((ele) => ele.chainId === toChainId)?.chainImageUrl,
    [chainList, toChainId],
  );
  const EstimateAmount = useMemo(() => {
    // adjust etransfer
    if (
      ZERO.plus(amount).isLessThanOrEqualTo(transactionFee || '') &&
      tokenInfo?.symbol === 'ELF' &&
      transferType === TransferType.E_TRANSFER
    ) {
      return {
        estimateAmount: `0 ${tokenInfo?.label || tokenInfo?.symbol}`,
        estimateAmountUsd: isMainnet ? '$0' : '',
      };
    }

    // adjust etransfer & ebridge
    if (transferType === TransferType.E_BRIDGE || transferType === TransferType.E_TRANSFER) {
      return {
        estimateAmount: `${receiveAmount} ${tokenInfo?.label || tokenInfo?.symbol}`,
        estimateAmountUsd: isMainnet ? receiveAmountUsd : '',
      };
    }

    // _amount = formatAmountShow(_amount, Number(tokenInfo?.decimals));
    // const amountUsd = formatAmountShow(ZERO.plus(_amount).div(price));

    return {
      estimateAmount: `${amount} ${tokenInfo?.label || tokenInfo?.symbol}`,
      estimateAmountUsd: isMainnet ? usdAmount : '',
    };
  }, [
    amount,
    isMainnet,
    receiveAmount,
    receiveAmountUsd,
    tokenInfo?.label,
    tokenInfo?.symbol,
    transactionFee,
    transferType,
    usdAmount,
  ]);

  const estimatedTime = useMemo(
    () => (targetNetwork ? getEstimatedTime(targetNetwork, transferType) : ''),
    [targetNetwork, transferType],
  );

  const [isShowNetworkFee, isShowTransactionFee] = useMemo(() => {
    return [
      transferType === TransferType.GENERAL_CROSS_CHAIN || transferType === TransferType.GENERAL_SAME_CHAIN,
      transferType === TransferType.E_BRIDGE || transferType === TransferType.E_TRANSFER,
    ];
  }, [transferType]);

  return (
    <div className={clsx('send-preview-wrap', className)}>
      <div className="flex-column-center">
        <CustomSvgV3 type="Activity=Send" />
        <div className="amount-show">{`${formatAmountShow(amount, tokenInfo?.decimals)} ${tokenInfo?.symbol}`}</div>
        <div className="usd-show">{`${formatAmountUSDShow(usdAmount)}`}</div>
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
      {isShowTransactionFee && (
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
            <div>{`${transactionFee} ${transactionUnit}`}</div>
            {/* <div className="below-show text-color-danger">{`$ `}</div> */}
          </div>
        </div>
      )}
      {isShowNetworkFee && (
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
            <div className="below-show">{`$0`}</div>
          </div>
        </div>
      )}
      <div className="flex-between-center content-row-info">
        <div className="flex-row-center gap-4">{`Amount to receive`}</div>
        <div className="value-show">
          <div>{EstimateAmount.estimateAmount}</div>
          <div className="below-show">{EstimateAmount?.estimateAmountUsd}</div>
        </div>
      </div>
      {(transferType === TransferType.E_BRIDGE || transferType === TransferType.E_TRANSFER) && (
        <div className="flex-between-center content-row-info">
          <div>{`Estimated duration`}</div>
          <div className="value-show">{estimatedTime}</div>
        </div>
      )}
      {(transferType === TransferType.E_BRIDGE || transferType === TransferType.E_TRANSFER) && (
        <div className="flex-center powered-by gap-4">
          <div>{`Powered by`}</div>
          <CustomSvgV3 type={transferType === TransferType.E_BRIDGE ? 'Provider=eBridge' : 'Provider=ETransfer'} />
        </div>
      )}
    </div>
  );
}
