import { BlockchainNetworkType } from 'constants/network';
import './index.less';
import CustomSvg from 'components/CustomSvg';

export default function NetworkLogo({ network }: { network: string | undefined; className?: string }) {
  switch (network) {
    case BlockchainNetworkType.AELF:
    case BlockchainNetworkType.tDVW:
    case BlockchainNetworkType.tDVV:
      return <CustomSvg type="Aelf" />;
    case BlockchainNetworkType.Ethereum:
      return <CustomSvg type="Ethereum" />;
    case BlockchainNetworkType.Polygon:
      return <CustomSvg type="Polygon" />;
    case BlockchainNetworkType.Arbitrum:
      return <CustomSvg type="Arbitrum" />;
    case BlockchainNetworkType.Optimism:
      return <CustomSvg type="Optimism" />;
    case BlockchainNetworkType.Solana:
      return <CustomSvg type="Solana" />;
    case BlockchainNetworkType.Tron:
      return <CustomSvg type="Tron" />;
    case BlockchainNetworkType.Binance:
      return <CustomSvg type="Binance" />;
    case BlockchainNetworkType.Avax:
      return <CustomSvg type="Avax" />;
    case BlockchainNetworkType.Ton:
      return <CustomSvg type="Ton" />;
    default:
      // when not match network's type, display first character and uppercase
      return <div className={'deposit-network'}>{network?.charAt(0).toUpperCase()}</div>;
  }
}
