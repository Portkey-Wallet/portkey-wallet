import { IClickAddressProps, RecentContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import ContactCard from './ContactCard';
import CustomSvg from 'components/CustomSvg';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import { ChainId } from '@portkey-wallet/types';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

export default function RecentItem({
  item,
  onClick,
}: {
  item: RecentContactItemType;
  onClick: (account: IClickAddressProps) => void;
}) {
  const isMainnet = useIsMainnet();
  const navigate = useNavigate();

  const goRecentDetail = (
    chainId: ChainId,
    targetAddress: string,
    targetChainId: ChainId,
    name: string,
    index: string,
  ) => {
    navigate('/recent-detail', { state: { chainId, targetAddress, targetChainId, name, index } });
  };

  return item.name ? (
    <ContactCard user={item} onChange={onClick} className="contact-card-in-recent" chainId={item.chainId} />
  ) : (
    // In order to keep the format of Recents and Contacts consistent, this can use like {item.addresses[0]}
    <div className={clsx(['flex-between-center', 'recent-item'])}>
      <div
        className="main-info"
        onClick={() => {
          onClick({ ...item });
        }}>
        <p className="address">{`ELF_${formatStr2EllipsisStr(item.address, [6, 6])}_${item.addressChainId}`}</p>
        <p className="network">{transNetworkText(item.addressChainId, !isMainnet)}</p>
      </div>

      <div
        className="go-detail"
        onClick={() => goRecentDetail(item.chainId, item.address, item.addressChainId, item.name, item?.index)}>
        <CustomSvg className="go-detail-icon" type={'Info'} />
      </div>
    </div>
  );
}
