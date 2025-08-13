import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';
import { IContactItemType, TFormattedRecentItem } from '@portkey-wallet/types/types-eoa/contact';
import MyAddress from './MyAddress';
import { getAelfAddress } from '@portkey-wallet/utils/aelf';
import { ContactListItem } from './Contacts';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { useCallback } from 'react';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';

export default function RecentItem({
  item,
  onClick,
}: {
  item: TFormattedRecentItem;
  onClick: (account: IContactItemType) => void;
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
    navigate('/recent-detail', { state: { ...item, isFromSend: true } });
  };

  const wallet = useCurrentAccount();
  const isMyAddress =
    getAelfAddress(item.addressInfo?.address) === wallet?.address || getAelfAddress(item.address) === wallet?.address;
  const isMyContact = !!item?.name;

  if (isMyAddress)
    return (
      <MyAddress
        isEqChain
        chainId={item.chainId || item.addressInfo?.chainId || 'AELF'}
        onClick={(item) => {
          onClick(item as IContactItemType);
        }}
      />
    );

  if (isMyContact)
    return (
      <ContactListItem
        item={item as IContactItemType}
        onChange={(item) => {
          onClick(item);
        }}
      />
    );

  return (
    // In order to keep the format of Recents and Contacts consistent, this can use like {item.addresses[0]}
    <div
      className={clsx(['flex-between-center', 'recent-item'])}
      onClick={() => {
        onClick(item as IContactItemType);
      }}>
      <TokenImageDisplay subDisplay={true} chain={item?.addressInfo?.chainId === 'AELF' ? 'main' : 'dApp'} />
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
