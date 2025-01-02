import { IClickAddressProps } from '@portkey-wallet/types/types-ca/contact';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { IContactItemType, TFormattedRecentItem } from '@portkey-wallet/types/types-ca/contactNew';
import { useCaAddresses } from '@portkey-wallet/hooks/hooks-ca/wallet';
import MyAddress from './MyAddress';
import { getAelfAddress } from '@portkey-wallet/utils/aelf';
import { ContactListItem } from './Contacts';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { useCallback } from 'react';

export default function RecentItem({
  item,
  onClick,
}: {
  item: TFormattedRecentItem;
  onClick: (account: IClickAddressProps) => void;
}) {
  const isMainnet = useIsMainnet();
  const navigate = useNavigate();

  const transformContactData = useCallback((item: any): IContactItemType => {
    if (item?.addressInfo) return item;

    return {
      id: '',
      addressInfo: {
        ...item,
        networkImage: item.networkIcon,
      },
      index: '',
      name: '',
      isDeleted: false,
      userId: '',
      modificationTime: 0,
      ...item,
    };
  }, []);

  const goRecentDetail = (item: IContactItemType) => {
    navigate('/recent-detail', { state: item });
  };

  const caAddresses = useCaAddresses();
  const isMyAddress =
    getAelfAddress(item.addressInfo?.address) === caAddresses?.[0] || getAelfAddress(item.address) === caAddresses?.[0];
  const isMyContact = !!item?.name;
  console.log('isMyContact', isMyContact);

  if (isMyAddress) return <MyAddress chainId={item.chainId || item.addressInfo?.chainId || 'AELF'} onClick={onClick} />;

  if (isMyContact) return <ContactListItem item={item as IContactItemType} onChange={onClick} />;

  console.log('item', item);

  return (
    // In order to keep the format of Recents and Contacts consistent, this can use like {item.addresses[0]}
    <div
      className={clsx(['flex-between-center', 'recent-item'])}
      onClick={() => {
        onClick(item as IClickAddressProps);
      }}>
      <TokenImageDisplay
        src={item?.caHolderInfo?.avatar}
        subDisplay={true}
        chain={item?.addressInfo?.chainId === 'AELF' ? 'main' : 'dApp'}
      />
      <div className="center">
        <p className="address">{formatStr2EllipsisStr(item.address || item.addressInfo?.address)}</p>
        <p className="gap" />
        <p className="network">
          {item.addressInfo?.network === 'aelf' || item.network === 'aelf'
            ? transNetworkText(item?.chainId || item.addressInfo?.chainId || '', !isMainnet)
            : item.network || item.addressInfo?.networkName}
        </p>
      </div>
      <div className="info-icon" onClick={() => goRecentDetail(transformContactData(item))}>
        <CustomSvgV3 type="info" className="info-icon" />
      </div>
    </div>
  );
}
