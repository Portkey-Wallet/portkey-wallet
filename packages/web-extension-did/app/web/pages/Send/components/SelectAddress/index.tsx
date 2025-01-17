import { ICaAddressInfoListItemType } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { IContactItemType, TFormattedRecentItem } from '@portkey-wallet/types/types-ca/contactNew';
import { useContactNetworkConfig } from '@portkey-wallet/hooks/hooks-ca/config';
import { useCallback } from 'react';
import { AELF_NETWORK_NAME } from '@portkey-wallet/constants/constants-ca/common';
import ContactItem from 'pages/components/ContactItem';
import ContactItemMy, { IContactItemMy } from 'pages/components/ContactItemMy';
// TODO-SA
// import { RECENT_PAGE_NAME } from 'constants/contact';

export enum SelectAddressTabTypeEnum {
  Recent = 'Recent',
  Saved = 'Saved',
}

export function AddressList({
  addressList,
  onClick,
  isMyAddress = false,
  type = SelectAddressTabTypeEnum.Recent,
}: {
  addressList: TFormattedRecentItem[] | ICaAddressInfoListItemType[];
  chainId: string;
  onClick?: (item: TFormattedRecentItem) => void;
  isMyAddress?: boolean;
  type: SelectAddressTabTypeEnum;
}) {
  const { supportNetworkList } = useContactNetworkConfig();

  const getNetworkName = useCallback(
    (chainId: string, network: string) => {
      const networkItem = supportNetworkList?.find((item) => {
        let isChainIdMatch = true;
        if (network === AELF_NETWORK_NAME) {
          isChainIdMatch = item.chainId === chainId;
        }
        return item.network === network && isChainIdMatch;
      });
      return networkItem?.name ?? '';
    },
    [supportNetworkList],
  );

  const renderItem = useCallback(
    (item: TFormattedRecentItem | ICaAddressInfoListItemType | any, index: number) => {
      const address = item?.name ? item?.caHolderInfo?.address : item?.address;
      const contactProps: IContactItemType = item?.name
        ? item
        : {
            id: address,
            index: String(index),
            name: item?.name || address,
            addressInfo: {
              network: item?.network, // aelf ETH BSC
              networkName: getNetworkName(item?.chainId, item?.network), //  aelf MainChain
              chainId: item?.chainId ?? '', // tDVW TDVV
              networkImage: item?.networkIcon,
              address: address,
            },
            caHolderInfo: item?.caHolderInfo,
            userId: address,
            modificationTime: item?.transferTime,
            isDeleted: false,
          };
      const isSaved = item?.name ? true : false;
      return (
        <ContactItem
          contact={contactProps}
          showInfoIcon={!isMyAddress}
          isSaved={isSaved}
          onClick={() => {
            onClick?.(item);
          }}
          onInfoIconClick={() => {
            // TODO-SA
            // navigationService.navigate('NoChatContactProfile', {
            //   contact: contactProps,
            //   isSaved,
            //   from: RECENT_PAGE_NAME,
            // });
          }}
        />
      );
    },
    [getNetworkName, isMyAddress, onClick],
  );

  return (
    <div className="address-list-wrap">
      {addressList.length === 0 ? (
        <div className="no-data-message flex-center">{`No ${
          type === SelectAddressTabTypeEnum.Recent ? 'recent' : 'saved'
        } address`}</div>
      ) : (
        addressList.map((ads, i) => renderItem(ads, i))
      )}
    </div>
  );
}

interface ISelectAddressProps {
  recentAddressList: TFormattedRecentItem[];
  savedAddressList: TFormattedRecentItem[];
  myAddressList: IContactItemMy[];
  chainId: ChainId;
  onClick?: (item: TFormattedRecentItem) => void;
}

export default function SelectAddress(props: ISelectAddressProps) {
  const { recentAddressList, savedAddressList, myAddressList, chainId, onClick } = props;

  // TODO-SA Tab
  return (
    <>
      <AddressList
        addressList={savedAddressList}
        chainId={chainId}
        onClick={onClick}
        type={SelectAddressTabTypeEnum.Saved}
      />
      <AddressList
        addressList={recentAddressList}
        chainId={chainId}
        onClick={onClick}
        type={SelectAddressTabTypeEnum.Recent}
      />
      <ContactItemMy addressList={myAddressList} onClick={onClick} />
    </>
  );
}
