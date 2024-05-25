import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import { useLocationState } from 'hooks/router';
import { useMemo } from 'react';
import { TReceiveLocationState } from 'types/router';
import './index.less';

const EXCHANGE_PARTNER_SVG_LIST = [
  'ExchangePartner1',
  'ExchangePartner2',
  'ExchangePartner3',
  'ExchangePartner4',
  'ExchangePartner5',
  'ExchangePartner6',
] as const;

export default function ExchangePage() {
  const { state } = useLocationState<TReceiveLocationState>();
  const wallet = useCurrentWalletInfo();
  const caAddress = useMemo(
    () => `ELF_${wallet?.[state.chainId || 'AELF']?.caAddress}_${state.chainId}`,
    [state, wallet],
  );

  return (
    <div className="exchange-page flex-column-center">
      <div className="exchange-page-logo flex-column-center">
        <CustomSvg type="ExchangeLogo" />
        <div className="exchange-logo-tip">
          Experience seamless asset transfers from cryptocurrency exchanges to your Portkey wallet.
        </div>
      </div>
      <div className="exchange-page-partner flex-column">
        <div className="exchange-partner-svg-list flex-row-center">
          {EXCHANGE_PARTNER_SVG_LIST.map((type, index) => (
            <div key={index} className="exchange-partner-svg-item">
              <CustomSvg type={type} />
            </div>
          ))}
        </div>
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
