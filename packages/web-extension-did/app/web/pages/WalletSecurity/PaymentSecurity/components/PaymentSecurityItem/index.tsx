import { IPaymentSecurityItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import CustomSvg from 'components/CustomSvg';
import './index.less';
import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

export default function PaymentSecurityItem({
  item,
  onClick,
}: {
  item: IPaymentSecurityItem;
  onClick: (item: IPaymentSecurityItem) => void;
}) {
  const isMainnet = useIsMainnet();

  return (
    <div className="flex-row-between payment-security-item" onClick={() => onClick(item)}>
      <div className="flex-center">
        {item.symbol === ELF_SYMBOL ? (
          <CustomSvg className="token-logo" type="elf-icon" />
        ) : (
          <div className="token-logo custom-word-logo">{item.symbol?.slice(0, 1)}</div>
        )}
        <div className="token-info">
          <div className="token-symbol">{item.symbol}</div>
          <div className="token-network">{transNetworkText(item.chainId, !isMainnet)}</div>
        </div>
      </div>
      <CustomSvg type="LeftArrow" className="left-arrow" />
    </div>
  );
}
