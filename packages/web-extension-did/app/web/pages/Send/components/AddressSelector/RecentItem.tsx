import { IClickAddressProps, RecentContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import { useIsTestnet } from 'hooks/useNetwork';
import ContactCard from './ContactCard';
import CustomSvg from 'components/CustomSvg';
import { useNavigate } from 'react-router';
import clsx from 'clsx';

export default function RecentItem({
  item,
  onClick,
}: {
  item: RecentContactItemType;
  onClick: (account: IClickAddressProps) => void;
}) {
  const isTestNet = useIsTestnet();
  const navigate = useNavigate();

  const goRecentDetail = (address: string, chainId: string) => {
    navigate('/recent-detail', { state: { address, chainId } });
  };

  return item.name ? (
    <ContactCard user={item} onChange={onClick} className="contact-card-in-recent" />
  ) : (
    // In order to keep the format of Recents and Contacts consistent, this can use like {item.addresses[0]}
    <div
      className={clsx(['flex-between-center', 'recent-item'])}
      onClick={() => {
        onClick({ ...item });
      }}>
      <div className="main-info">
        <p className="address">{`ELF_${formatStr2EllipsisStr(item.address, [6, 6])}_${item.addressChainId}`}</p>
        <p className="network">{transNetworkText(item.addressChainId, isTestNet)}</p>
      </div>

      <CustomSvg
        className="go-detail-icon"
        type={'Info'}
        onClick={() => goRecentDetail(item.address, item.addressChainId)}
      />
    </div>
  );
}
