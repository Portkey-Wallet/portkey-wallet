import { ITransferLimitItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import CustomSvg from 'components/CustomSvg';
import './index.less';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';

export default function PaymentSecurityItem({
  item,
  onClick,
}: {
  item: ITransferLimitItem;
  onClick: (item: ITransferLimitItem) => void;
}) {
  const isMainnet = useIsMainnet();

  return (
    <div className="flex-row-between payment-security-item" onClick={() => onClick(item)}>
      <div className="flex-center">
        <TokenImageDisplay symbol={item.symbol} src={item.imageUrl} />
        <div className="token-info">
          <div className="token-symbol">{item.symbol}</div>
          <div className="token-network">{transNetworkText(item.chainId, !isMainnet)}</div>
        </div>
      </div>
      <CustomSvg type="LeftArrow" className="left-arrow" />
    </div>
  );
}
