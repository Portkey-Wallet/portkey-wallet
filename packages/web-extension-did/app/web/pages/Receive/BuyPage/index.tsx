import BuyForm from 'pages/Buy/components/BuyForm';
import { ReceiveTabEnum } from '@portkey-wallet/constants/constants-ca/send';
import { useLocationState } from 'hooks/router';
import { TReceiveLocationState } from 'types/router';
import { useMemo } from 'react';
import './index.less';

export interface IBuyPageProps {
  fiat?: string;
  amount?: string;
  crypto: string;
}

export default function BuyPage({ fiat, amount, crypto }: IBuyPageProps) {
  const { state } = useLocationState<TReceiveLocationState>();
  const newState = useMemo(() => {
    const tokenInfo = {
      symbol: state.symbol,
      chainId: state.chainId,
      decimals: Number(state.decimals),
      balance: state.balance,
      tokenContractAddress: state.address,
    };
    const _newState = {
      fiat,
      amount,
      crypto,
    };
    return {
      tokenInfo,
      ..._newState,
    };
  }, [state, fiat, crypto, amount]);

  return (
    <div className="buy-frame receive-buy-page">
      <div className="buy-content flex-column">
        <BuyForm mainPageInfo={{ pageName: ReceiveTabEnum.Buy, newState }} />
      </div>
    </div>
  );
}
