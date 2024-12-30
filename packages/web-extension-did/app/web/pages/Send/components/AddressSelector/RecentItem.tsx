import { IClickAddressProps, RecentContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import ContactCard from './ContactCard';
import CustomSvg from 'components/CustomSvg';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import { ChainId } from '@portkey-wallet/types';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { TFormattedRecentItem } from '@portkey-wallet/types/types-ca/contactNew';
import { useCaAddresses } from '@portkey-wallet/hooks/hooks-ca/wallet';
import MyAddress from './MyAddress';

export default function RecentItem({
  item,
  onClick,
}: {
  item: TFormattedRecentItem;
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

  const caAddresses = useCaAddresses();
  const isMyAddress = item.addressInfo?.address === caAddresses?.[0];
  const isMyContact = item.name && !item?.addressInfo;

  if (isMyAddress) return <MyAddress chainId={item.chainId || item.addressInfo?.chainId || 'AELF'} onClick={onClick} />;

  if (isMyContact)
    return (
      <ContactCard
        onChange={onClick}
        className="contact-card-in-recent"
        chainId={item.chainId || item.addressInfo?.chainId || 'AELF'}
        user={undefined}
      />
    );

  return (
    // In order to keep the format of Recents and Contacts consistent, this can use like {item.addresses[0]}
    <div className={clsx(['flex-between-center', 'recent-item'])}>
      <div
        className="main-info"
        onClick={() => {
          onClick({ ...item });
        }}>
        <p className="address">{item.address || item.addressInfo?.address}</p>
        <p className="network">
          {item.addressInfo?.network === 'aelf'
            ? transNetworkText(item.addressInfo.address, !isMainnet)
            : item.addressInfo?.networkName}
        </p>
      </div>

      <div
        className="go-detail"
        onClick={() => goRecentDetail(item.chainId, item.address, item.addressChainId, item.name, item?.index)}>
        <CustomSvg className="go-detail-icon" type={'Info'} />
      </div>
    </div>
  );
}
