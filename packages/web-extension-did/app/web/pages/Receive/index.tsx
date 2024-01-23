import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { QRCodeDataObjType, shrinkSendQrData } from '@portkey-wallet/utils/qrCode';
import clsx from 'clsx';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import PromptFrame from 'pages/components/PromptFrame';
import QRCodeCommon from 'pages/components/QRCodeCommon';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useCommonState, useWalletInfo } from 'store/Provider/hooks';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import './index.less';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import {
  SideChainTipContent,
  SideChainTipTitle,
  MainChainTipTitle,
  MainChainTipContent,
} from '@portkey-wallet/constants/constants-ca/send';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useLocationState } from 'hooks/router';
import { TReceiveLocationState } from 'types/router';

export default function Receive() {
  const navigate = useNavigate();
  const { symbol } = useParams();
  const { state } = useLocationState<TReceiveLocationState>();
  const wallet = useCurrentWalletInfo();
  const { currentNetwork } = useWalletInfo();
  const isMainnet = useIsMainnet();
  const caAddress = useMemo(
    () => `ELF_${wallet?.[state.chainId || 'AELF']?.caAddress}_${state.chainId}`,
    [state, wallet],
  );
  const tipTitle = useMemo(
    () => (state.chainId === MAIN_CHAIN_ID ? MainChainTipTitle : SideChainTipTitle),
    [state.chainId],
  );
  const tipContent = useMemo(
    () => (state.chainId === MAIN_CHAIN_ID ? MainChainTipContent : SideChainTipContent),
    [state.chainId],
  );

  const rightElement = useMemo(() => {
    return (
      <div>
        <CustomSvg onClick={() => navigate(-1)} type="Close2" />
      </div>
    );
  }, [navigate]);

  const value: QRCodeDataObjType = useMemo(
    () => ({
      type: 'send',
      sendType: 'token',
      networkType: currentNetwork,
      chainType: 'aelf',
      toInfo: {
        address: caAddress,
        name: '',
      },
      assetInfo: {
        symbol: state.symbol as string,
        chainId: state.chainId as ChainId,
        balance: state.balance as string,
        imageUrl: state.imageUrl as string,
        tokenContractAddress: state.address,
        balanceInUsd: state.balanceInUsd,
        decimals: state.decimals,
      },
      address: caAddress,
    }),
    [caAddress, currentNetwork, state],
  );

  const { isPrompt } = useCommonState();
  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['receive-wrapper', isPrompt && 'detail-page-prompt'])}>
        <TitleWrapper leftElement rightElement={rightElement} />
        <div className="receive-content">
          <div className={clsx(['single-account'])}>
            <div className="name">My Wallet Address to Receive</div>
          </div>
          <div className="token-info">
            <TokenImageDisplay width={24} className="icon" symbol={symbol} src={state?.imageUrl} />
            <p className="symbol">{symbol}</p>
            <p className="network">{transNetworkText(state.chainId, !isMainnet)}</p>
          </div>
          <QRCodeCommon value={JSON.stringify(shrinkSendQrData(value))} />
          <div className="receive-address">
            <div className="address">{caAddress}</div>
            <Copy className="copy-icon" toCopy={caAddress}></Copy>
          </div>
          <div className="flex receive-tip">
            <CustomSvg type="Info" />
            <div className="receive-tip-text">
              <div className="receive-tip-title">{tipTitle}</div>
              <div>{tipContent}</div>
            </div>
          </div>
        </div>
        {isPrompt && <PromptEmptyElement />}
      </div>
    );
  }, [
    caAddress,
    isPrompt,
    isMainnet,
    rightElement,
    state.chainId,
    state?.imageUrl,
    symbol,
    tipContent,
    tipTitle,
    value,
  ]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
