import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { QRCodeDataObjType, shrinkSendQrData } from '@portkey-wallet/utils/qrCode';
import clsx from 'clsx';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import { useIsTestnet } from 'hooks/useNetwork';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import PromptFrame from 'pages/components/PromptFrame';
import QRCodeCommon from 'pages/components/QRCodeCommon';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useCommonState, useWalletInfo } from 'store/Provider/hooks';
import './index.less';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { SideChainTipContent, SideChainTipTitle } from '@portkey-wallet/constants/constants-ca/send';

export default function Receive() {
  const navigate = useNavigate();
  const { symbol } = useParams();
  const { state } = useLocation();
  const wallet = useCurrentWalletInfo();
  const { currentNetwork } = useWalletInfo();
  const isTestNet = useIsTestnet();
  const caAddress = useMemo(
    () => `ELF_${wallet?.[(state.chainId as ChainId) || 'AELF']?.caAddress}_${state.chainId}`,
    [state, wallet],
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
      netWorkType: currentNetwork,
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
            {symbol === 'ELF' ? <CustomSvg type="elf-icon" /> : <div className="icon">{symbol?.[0]}</div>}
            <p className="symbol">{symbol}</p>
            <p className="network">{transNetworkText(state.chainId, isTestNet)}</p>
          </div>
          <QRCodeCommon value={JSON.stringify(shrinkSendQrData(value))} />
          <div className="receive-address">
            <div className="address">{caAddress}</div>
            <Copy className="copy-icon" toCopy={caAddress}></Copy>
          </div>
          {state.chainId !== MAIN_CHAIN_ID && (
            <div className="flex receive-tip">
              <CustomSvg type="Info" />
              <div className="receive-tip-text">
                <div className="receive-tip-title">{SideChainTipTitle}</div>
                <div>{SideChainTipContent}</div>
              </div>
            </div>
          )}
        </div>
        {isPrompt && <PromptEmptyElement />}
      </div>
    );
  }, [caAddress, isPrompt, isTestNet, rightElement, state.chainId, symbol, value]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
