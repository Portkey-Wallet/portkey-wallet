import { useCallback, useMemo } from 'react';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import QRCodeCommon from 'pages/components/QRCodeCommon';
import CommonAddress from 'components/CommonAddress';
import { TDepositInfo, TNetworkItem, TRecordsStatus, TTokenItem } from '@portkey-wallet/types/types-ca/deposit';
import CommonHeader from 'components/CommonHeader';
import { useDepositRecord } from '@portkey-wallet/hooks/hooks-ca/deposit';
import clsx from 'clsx';
import { FormatNameRuleList, formatNameWithRules } from '@portkey-wallet/utils';
export interface IDepositAddressProps {
  depositInfo: TDepositInfo | undefined;
  fromNetwork: TNetworkItem | undefined;
  fromToken: TTokenItem | undefined;
  toToken: TTokenItem | undefined;
  isSameSymbol?: boolean;
  onClose?: () => void;
  type?: 'component' | 'page';
}
export default function DepositAddress(props: IDepositAddressProps) {
  const { onClose, type = 'component', depositInfo, fromNetwork, fromToken, isSameSymbol } = props;
  console.log('wfs DepositAddress props', props);
  const { isPrompt } = useCommonState();
  const { lastRecord } = useDepositRecord({
    fromSymbol: fromToken?.symbol || '',
    address: depositInfo?.depositAddress || '',
  });
  const contractAddressShow = useMemo(() => {
    return fromNetwork?.contractAddress?.slice(0, 6) + '...' + fromNetwork?.contractAddress?.slice(-6);
  }, [fromNetwork?.contractAddress]);

  const msgStatusIcon = useMemo(() => {
    if (lastRecord?.status === TRecordsStatus.Succeed) {
      return 'MsgSuccess';
    } else if (lastRecord?.status === TRecordsStatus.Processing) {
      return 'MsgProcessing';
    }
    return 'MsgFailed';
  }, [lastRecord?.status]);

  const recordText = useMemo(() => {
    const link = 'https://t.me/Portkey_Official_Group';
    if (isSameSymbol) {
      if (lastRecord?.status === TRecordsStatus.Succeed) {
        return `Deposit successful, with ${lastRecord.toTransfer?.amount} ${lastRecord.toTransfer?.symbol} sent to you.`;
      } else if (lastRecord?.status === TRecordsStatus.Failed) {
        return (
          <span>
            Swap failed. Please contact the{' '}
            <a href={link} target="_blank" rel="noopener noreferrer">
              Portkey team
            </a>{' '}
            for help.
          </span>
        );
      } else if (lastRecord?.status === TRecordsStatus.Processing) {
        return `${lastRecord.toTransfer?.amount} ${lastRecord.toTransfer?.symbol} received, pending cross-chain transfer.`;
      }
    } else {
      if (lastRecord?.status === TRecordsStatus.Succeed) {
        return `Swap successful, with ${lastRecord.toTransfer?.amount} ${lastRecord.toTransfer?.symbol} sent to you.`;
      } else if (lastRecord?.status === TRecordsStatus.Failed) {
        return `Swap failed, with ${lastRecord.toTransfer?.amount} ${lastRecord.toTransfer?.symbol} sent to you.`;
      } else if (lastRecord?.status === TRecordsStatus.Processing) {
        return `${lastRecord.toTransfer?.amount} ${lastRecord.toTransfer?.symbol} received, pending swap.`;
      }
    }
    return undefined;
  }, [isSameSymbol, lastRecord?.status, lastRecord?.toTransfer?.amount, lastRecord?.toTransfer?.symbol]);
  const openOnExplorer = useCallback(() => {
    window.open(fromNetwork?.explorerUrl, '_blank');
  }, [fromNetwork?.explorerUrl]);
  const headerEle = useMemo(() => {
    return (
      <CommonHeader
        title={'Deposit Address'}
        onLeftBack={() => {
          onClose?.();
        }}
      />
    );
  }, [onClose]);
  const qrCodeEle = useMemo(() => {
    return (
      <div className="qr-code-card">
        <div className="qr-code-title">
          <div className="qr-code-token-info">
            <img className="token-img" src={fromToken?.icon} />
            <div className="qr-code-token-name">{fromToken?.symbol}</div>
          </div>
          <div className="token-network">{fromNetwork?.name}</div>
        </div>
        <div className="qr-code-container">
          <QRCodeCommon
            value={depositInfo?.depositAddress || ''}
            logo={{
              url:
                fromToken?.icon ||
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgNFxQx-fPrn1VqNkWC2Y3gDr8JDAZgxkGvA&usqp=CAU',
              width: 23,
              height: 23,
            }}
          />
        </div>
      </div>
    );
  }, [depositInfo?.depositAddress, fromNetwork?.name, fromToken?.icon, fromToken?.symbol]);
  const addressInfoEle = useMemo(() => {
    return (
      <div className="address-and-info-container">
        <CommonAddress label="Deposit Address" value={depositInfo?.depositAddress || ''} />
        <div className="minimum-deposit-container">
          <div className="minimum-deposit">Minimum Deposit</div>
          <div className="minimum-deposit-cal-container">
            <div className="minimum-deposit-token-amount">
              {depositInfo?.minAmount} {formatNameWithRules(fromToken?.symbol || '', [FormatNameRuleList.NO_UNDERLINE])}
            </div>
            <div className="minimum-deposit-token-price">$ {depositInfo?.minAmountUsd}</div>
          </div>
        </div>
        <div className="contract-address-container">
          <div className="contract-address-title">Contract Address</div>
          <div className="contract-address" onClick={openOnExplorer}>
            {contractAddressShow}
          </div>
        </div>
      </div>
    );
  }, [
    contractAddressShow,
    depositInfo?.depositAddress,
    depositInfo?.minAmount,
    depositInfo?.minAmountUsd,
    fromToken?.symbol,
    openOnExplorer,
  ]);
  const hintTextEle = useMemo(() => {
    const notes = depositInfo?.extraNotes || [];
    return (
      <div className="hint-container">
        <div className="hint-content">
          {notes.map((note, index) => (
            <p key={index}>• {note}</p>
          ))}
        </div>
      </div>
    );
  }, [depositInfo?.extraNotes]);
  const showMsgEle = useMemo(() => {
    return (
      <div
        className={clsx([
          'msg-container',
          msgStatusIcon === 'MsgProcessing' && 'msg-container-processing-bg',
          msgStatusIcon === 'MsgFailed' && 'msg-container-failed-bg',
          msgStatusIcon === 'MsgSuccess' && 'msg-container-success-bg',
        ])}>
        <CustomSvg type={msgStatusIcon} />
        <div className="msg-content">{recordText}</div>
      </div>
    );
  }, [msgStatusIcon, recordText]);
  // isPrompt && 'detail-page-prompt'
  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['deposit-address-container', isPrompt && 'detail-page-prompt'])}>
        {headerEle}
        <div className="body" style={{ paddingTop: recordText ? 0 : 8 }}>
          {recordText && showMsgEle}
          {qrCodeEle}
          {addressInfoEle}
          {hintTextEle}
        </div>
      </div>
    );
  }, [isPrompt, headerEle, recordText, showMsgEle, qrCodeEle, addressInfoEle, hintTextEle]);

  return <>{isPrompt && type === 'page' ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
