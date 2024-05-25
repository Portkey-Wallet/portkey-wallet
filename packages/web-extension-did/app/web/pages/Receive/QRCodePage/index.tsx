import { ChainId } from '@portkey-wallet/types';
import QRCodeCommon from 'pages/components/QRCodeCommon';
import Copy from 'components/CopyAddress';
import { useLocationState } from 'hooks/router';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useWalletInfo } from 'store/Provider/hooks';
import { useMemo } from 'react';
import { TReceiveLocationState } from 'types/router';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { RECEIVE_MAIN_CHAIN_ELF_TIP } from '@portkey-wallet/constants/constants-ca/send';
import { QRCodeDataObjType, shrinkSendQrData } from '@portkey-wallet/utils/qrCode';
import { DEFAULT_TOKEN } from '@portkey-wallet/constants/constants-ca/wallet';
import CustomSvg from 'components/CustomSvg';
import './index.less';

export default function QRCodePage() {
  const { state } = useLocationState<TReceiveLocationState>();
  const wallet = useCurrentWalletInfo();
  const { currentNetwork } = useWalletInfo();
  const caAddress = useMemo(
    () => `ELF_${wallet?.[state.chainId || 'AELF']?.caAddress}_${state.chainId}`,
    [state, wallet],
  );
  const isMainChain = useMemo(() => state.chainId === MAIN_CHAIN_ID, [state.chainId]);

  const showMainChainELFTip = useMemo(
    () => (isMainChain && state.symbol === DEFAULT_TOKEN.symbol ? RECEIVE_MAIN_CHAIN_ELF_TIP : ''),
    [isMainChain, state.symbol],
  );

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
  return (
    <div className="qr-code-page flex-column-center">
      <div className="qr-code-wrap flex-center">
        <QRCodeCommon value={JSON.stringify(shrinkSendQrData(value))} />
      </div>
      <div className="receive-address flex-column">
        <div className="label">Your aelf Address</div>
        <div className="flex-between-center address">
          <div className="address-text flex-1">{caAddress}</div>
          <Copy toCopy={caAddress} />
        </div>
      </div>
      <div className="flex receive-tip">
        <CustomSvg className="receive-tip-icon flex-center" type="InfoDefault" />
        <div className="receive-tip-text flex-1">
          Please use this address for receiving assets on the <span className="bold">aelf network</span> only.
          {showMainChainELFTip}
        </div>
      </div>
    </div>
  );
}
