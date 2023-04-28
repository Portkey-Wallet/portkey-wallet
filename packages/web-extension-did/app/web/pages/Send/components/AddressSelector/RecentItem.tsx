import { IClickAddressProps, RecentContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import { useIsTestnet } from 'hooks/useNetwork';
import ContactCard from './ContactCard';

export default function RecentItem({
  item,
  onClick,
}: {
  item: RecentContactItemType;
  onClick: (account: IClickAddressProps) => void;
}) {
  const isTestNet = useIsTestnet();

  return item.name ? (
    <ContactCard user={item} onChange={onClick} className="contact-card-in-recent" />
  ) : (
    // In order to keep the format of Recents and Contacts consistent, this can use like {item.addresses[0]}
    <div
      className="recent-item"
      onClick={() => {
        onClick({ ...item });
      }}>
      <p className="address">{`ELF_${formatStr2EllipsisStr(item.address, [6, 6])}_${item.addressChainId}`}</p>
      <p className="network">{transNetworkText(item.addressChainId, isTestNet)}</p>
    </div>
  );
}
