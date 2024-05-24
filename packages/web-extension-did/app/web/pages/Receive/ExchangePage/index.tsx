import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import { useLocationState } from 'hooks/router';
import { useMemo } from 'react';
import { TReceiveLocationState } from 'types/router';
import './index.less';

export default function ExchangePage() {
  const { state } = useLocationState<TReceiveLocationState>();
  const wallet = useCurrentWalletInfo();
  const caAddress = useMemo(() => wallet?.[state.chainId || 'AELF']?.caAddress || '', [state.chainId, wallet]);

  return (
    <div className="exchange-page flex-column-center">
      <div className="exchange-page-logo flex-column-center">
        <CustomSvg type="ExchangeLogo" />
        <div className="exchange-logo-tip">
          Experience seamless asset transfers from cryptocurrency exchanges to your Portkey wallet.
        </div>
      </div>
      <div className="exchange-page-partner flex-column">
        <CustomSvg type="ExchangePartner" />
        <div className="exchange-partner-operation flex-between-center">
          <div className="flex-column">
            <div className="operation-title">Receive ELF from top-tier exchanges</div>
            <div className="operation-desc">Click to copy your address</div>
          </div>
          <Copy toCopy={caAddress} />
        </div>
      </div>
    </div>
  );
}
