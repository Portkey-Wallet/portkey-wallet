import { IClickAddressProps } from '@portkey-wallet/types/types-ca/contact';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import CustomSvg from 'components/CustomSvg';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { IContactItemType, TFormattedRecentItem } from '@portkey-wallet/types/types-ca/contactNew';

export default function RecentItem({
  item,
  onClick,
}: {
  item: TFormattedRecentItem;
  onClick: (account: IClickAddressProps) => void;
}) {
  const isMainnet = useIsMainnet();
  const navigate = useNavigate();

  const goRecentDetail = (item: IContactItemType) => {
    navigate('/recent-detail', { state: item });
  };

  // const caAddresses = useCaAddresses();
  // const isMyAddress = item.addressInfo?.address === caAddresses?.[0];
  // const isMyContact = item.name && !item?.addressInfo;

  // if (isMyAddress) return <MyAddress chainId={item.chainId || item.addressInfo?.chainId || 'AELF'} onClick={onClick} />;

  // if (isMyContact)
  //   return (
  //     <ContactCard
  //       onChange={onClick}
  //       className="contact-card-in-recent"
  //       chainId={item.chainId || item.addressInfo?.chainId || 'AELF'}
  //     />
  //   );

  return (
    // In order to keep the format of Recents and Contacts consistent, this can use like {item.addresses[0]}
    <div className={clsx(['flex-between-center', 'recent-item'])}>
      <div
        className="main-info"
        onClick={() => {
          onClick(item as IClickAddressProps);
        }}>
        <p className="address">{item.address || item.addressInfo?.address}</p>
        <p className="network">
          {item.addressInfo?.network === 'aelf'
            ? transNetworkText(item.addressInfo.address, !isMainnet)
            : item.addressInfo?.networkName}
        </p>
      </div>

      <div className="go-detail" onClick={() => goRecentDetail(item as IContactItemType)}>
        <CustomSvg className="go-detail-icon" type={'Info'} />
      </div>
    </div>
  );
}
