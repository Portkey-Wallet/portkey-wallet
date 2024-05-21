import { useCallback, useEffect, useMemo, useState } from 'react';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import QRCodeCommon from 'pages/components/QRCodeCommon';
// import { getExploreLink } from '@portkey-wallet/utils';
import CommonAddress from 'components/CommonAddress';
export interface IDepositAddressProps {
  onClose?: () => void;
  type?: 'component' | 'page';
}
export default function DepositAddress(props: IDepositAddressProps) {
  const { onClose, type = 'component' } = props;
  const { isPrompt } = useCommonState();
  const [msg, setMsg] = useState<string | undefined>(undefined);
  useEffect(() => {
    setTimeout(() => {
      setMsg('Swap Success!  100 USDT has been sent to you.');
    }, 2000);
  }, [setMsg]);
  // const openOnExplorer = useCallback(() => {
  //   return getExploreLink(chainInfo?.explorerUrl || '', activityItem.transactionId || '', 'transaction');
  // }, [activityItem.transactionId, chainInfo?.explorerUrl]);
  const headerEle = useMemo(() => {
    return (
      <div className="ext-nav-bar">
        <span className="dev-mode">Deposit Address</span>
        <div
          className="suggest-close"
          onClick={() => {
            onClose?.();
          }}>
          <div className="union" />
        </div>
      </div>
    );
  }, [onClose]);
  const qrCodeEle = useMemo(() => {
    return (
      <div className="qr-code-card">
        <div className="qr-code-title">
          <div className="qr-code-token-info">
            <img
              className="token-img"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgNFxQx-fPrn1VqNkWC2Y3gDr8JDAZgxkGvA&usqp=CAU"
            />
            <div className="qr-code-token-name">USDT</div>
          </div>
          <div className="token-network">BNB Smart Chain</div>
        </div>
        <div className="qr-code-container">
          <QRCodeCommon
            value={'U97UqZe52baDgmvdhgt6hcQnWBjiEKayeywLXiFEuH5LAEFhB'}
            logo={{
              url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgNFxQx-fPrn1VqNkWC2Y3gDr8JDAZgxkGvA&usqp=CAU',
              width: 23,
              height: 23,
            }}
          />
        </div>
      </div>
    );
  }, []);
  const addressInfoEle = useMemo(() => {
    return (
      <div className="address-and-info-container">
        <CommonAddress label="Deposit Address" value="U97UqZe52baDgmvdhgt6hcQnWBjiEKayeywLXiFEuH5LAEFhB" />
        <div className="minimum-deposit-container">
          <div className="minimum-deposit">Minimum Deposit</div>
          <div className="minimum-deposit-cal-container">
            <div className="minimum-deposit-token-amount">1.23 SGR</div>
            <div className="minimum-deposit-token-price">$ 1.23</div>
          </div>
        </div>
        <div className="contract-address-container">
          <div className="contract-address-title">Contract Address</div>
          <div className="contract-address">0xc213...B58e8F</div>
        </div>
      </div>
    );
  }, []);
  const hintTextEle = useMemo(() => {
    return (
      <div className="hint-container">
        <div className="hint-content">
          • Your deposit will be finalised after X confirmations on the network.
          <br />
          • To avoid potential losses, please ensure you only deposit the token supported, XXXX.
          <br />• For the cross-chain transfer of XXX, you can view the details using the TXID on the deposit platform.
          <br />• For the swap to YYY, a fixed slippage rate will be applied. In the event of a failed transaction, you
          will receive XXX on aelf.
        </div>
      </div>
    );
  }, []);
  const showMsgEle = useMemo(() => {
    return (
      <div className="msg-container">
        <CustomSvg type="MsgSuccess" />
        <div className="msg-content">{msg}</div>
      </div>
    );
  }, [msg]);
  const mainContent = useCallback(() => {
    return (
      <div className="deposit-address-container">
        {headerEle}
        <div className="body" style={{ paddingTop: msg ? 0 : 8 }}>
          {msg && showMsgEle}
          {qrCodeEle}
          {addressInfoEle}
          {hintTextEle}
        </div>
      </div>
    );
  }, [headerEle, msg, showMsgEle, qrCodeEle, addressInfoEle, hintTextEle]);

  return <>{isPrompt && type === 'page' ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
