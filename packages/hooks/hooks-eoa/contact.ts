import {
  IAddContactItemApiType,
  IContactIndexType,
  IContactItemType,
  TDeleteContactItemParams,
  IEditContactItemApiType,
} from '@portkey-wallet/types/types-eoa/contact';
import { useCallback, useMemo } from 'react';
import { setContactAction, refreshContactMap } from '@portkey-wallet/store/store-eoa/contact/actions';
import { useAppCommonDispatch, useAppEOASelector, useEffectOnce } from '../index';
import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import { randomId } from '@portkey-wallet/utils';
import { useContactNetworkConfig, useTransferNetworkConfig } from './config';
import { ChainId } from '@portkey-wallet/types';
import { convertNameToAlphabet } from '@portkey-wallet/store/store-eoa/contact/utils';
import { useCurrentNetwork } from './network';

export const REFRESH_DELAY_TIME = 1.5 * 1000;

export const useAddContact = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetwork = useCurrentNetwork();
  const { supportNetworkList } = useContactNetworkConfig();

  return useCallback(
    async (contactItem: IAddContactItemApiType): Promise<IContactItemType> => {
      const item: IContactItemType = {
        ...contactItem,
        id: randomId(),
        index: convertNameToAlphabet(contactItem.name),
        isDeleted: false,
        addressInfo: {
          network: contactItem.network,
          networkName: contactItem.network,
          chainId: contactItem.chainId,
          networkImage:
            supportNetworkList?.find(
              item => item.network === contactItem.network && item.chainId === contactItem.chainId,
            )?.imageUrl || '',
          address: contactItem.address,
          isExchange: contactItem.isExchange,
        },
      };

      dispatch(
        setContactAction({
          network: currentNetwork,
          item,
        }),
      );

      return item;
    },
    [currentNetwork, dispatch, supportNetworkList],
  );
};

export const useEditContact = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetwork = useCurrentNetwork();
  const { supportNetworkList } = useContactNetworkConfig();

  return useCallback(
    async (contactItem: IEditContactItemApiType): Promise<IContactItemType> => {
      const item: IContactItemType = {
        ...contactItem,
        id: contactItem.id ?? '',
        index: convertNameToAlphabet(contactItem.name),
        addressInfo: {
          network: contactItem.network,
          networkName: contactItem.network,
          chainId: contactItem.chainId,
          networkImage:
            supportNetworkList?.find(
              item => item.network === contactItem.network && item.chainId === contactItem.chainId,
            )?.imageUrl || '',
          address: contactItem.address,
          isExchange: contactItem.isExchange,
        },
      };

      dispatch(
        setContactAction({
          network: currentNetwork,
          item,
        }),
      );
      return item;
    },
    [currentNetwork, dispatch, supportNetworkList],
  );
};

export const useDeleteContact = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetwork = useCurrentNetwork();

  return useCallback(
    async (contactItem: TDeleteContactItemParams): Promise<IContactItemType> => {
      const item: IContactItemType = {
        ...contactItem,
        isDeleted: true,
      };

      dispatch(
        setContactAction({
          network: currentNetwork,
          item,
        }),
      );
      return item;
    },
    [currentNetwork, dispatch],
  );
};

export const useContact = () => useAppEOASelector(state => state.contact);

export const useOriginContactList = () => {
  const contactIndexListMap = useAppEOASelector(state => state.contact.contactIndexList);
  const currentNetwork = useCurrentNetwork();
  return useMemo(() => contactIndexListMap?.[currentNetwork] || [], [contactIndexListMap, currentNetwork]);
};

export const useAllContactList = () => {
  const contactIndexList = useOriginContactList();

  return useMemo(() => {
    return contactIndexList.filter(c => c.contacts.length > 0);
  }, [contactIndexList]);
};

export const useContactList = () => {
  const allContactList = useAllContactList();

  return useMemo(() => {
    let result: IContactItemType[] = [];
    allContactList.forEach(ele => {
      result = [...result, ...ele.contacts];
    });
    return result;
  }, [allContactList]);
};

// in send page
export const useGetFilterContactList = () => {
  const contactList = useContactList();

  const { checkIsSupportTargetChain } = useTransferNetworkConfig();

  return useCallback(
    (params: { fromChainId: ChainId; tokenId: string; isFt?: boolean }) => {
      const { fromChainId, tokenId, isFt } = params;
      let result: IContactItemType[] = [];

      result = contactList.filter(ele => {
        if (isFt && ele.addressInfo.network !== 'aelf') return false;
        if (ele.addressInfo.network === 'aelf') return true;

        return checkIsSupportTargetChain({ fromChainId, symbol: tokenId, network: ele.addressInfo.network });
      });

      return result;
    },
    [checkIsSupportTargetChain, contactList],
  );
};

export const useCheckContactMap = () => {
  const dispatch = useAppCommonDispatch();

  useEffectOnce(() => {
    dispatch(refreshContactMap());
  });
};

export const useContactIdMap = () => {
  const currentNetwork = useCurrentNetwork();
  const contactIdMap = useAppEOASelector(state => state.contact.contactIdMap);
  return useMemo(() => contactIdMap?.[currentNetwork] || {}, [contactIdMap, currentNetwork]);
};

/**
 * @deprecated This hook is deprecated and will be removed in future versions.
 */
export const useContactPortkeyIdMap = () => {
  return {};
};

export const useContactInfoById = ({ contactId }: { contactId?: string }) => {
  const contactIdMap = useContactIdMap();

  return useMemo(() => {
    if (contactId) {
      return contactIdMap?.[contactId][0];
    }

    return undefined;
  }, [contactId, contactIdMap]);
};

export const useContactIndexList = () => {
  const contactIndexListMap = useAppEOASelector(state => state.contact.contactIndexList);
  const currentNetwork = useCurrentNetwork();

  return useMemo(() => contactIndexListMap?.[currentNetwork] || [], [contactIndexListMap, currentNetwork]);
};

export const useLocalContactSearch = () => {
  const contactIndexList = useContactIndexList();

  return useCallback(
    (value: string) => {
      const notEmptyFilterList = contactIndexList.filter(item => item?.contacts?.length > 0);

      // filter - no search value, return total
      if (!value) {
        const temp: IContactItemType[] = [];
        notEmptyFilterList.forEach(({ contacts }) => {
          temp.push(...contacts);
        });
        return { contactFilterList: temp, contactIndexFilterList: notEmptyFilterList };
      }

      // filter - have search value, return search result
      const contactIndexFilterList: IContactIndexType[] = [];
      const contactFilterList: IContactItemType[] = [];
      if (value.length <= 18) {
        const _v = value.trim().toLowerCase();
        notEmptyFilterList.forEach(({ index, contacts }) => {
          // Name search
          contactIndexFilterList.push({
            index,
            contacts: contacts.filter(contact => {
              return contact?.name?.trim().toLowerCase().includes(_v);
            }),
          });
        });
      } else {
        // Address search
        let suffix = '';
        if (value.includes('_')) {
          const arr = value.split('_');
          if (!isAelfAddress(arr[arr.length - 1])) {
            suffix = arr[arr.length - 1];
          }
        }
        value = getAelfAddress(value);
        notEmptyFilterList.forEach(({ index, contacts }) => {
          contactIndexFilterList.push({
            index,
            contacts: contacts.filter(contact => {
              if (contact.addressInfo.chainId && contact.addressInfo.network == 'aelf') {
                return suffix
                  ? contact.addressInfo.address === value && suffix === contact.addressInfo.chainId
                  : contact.addressInfo.address === value;
              } else {
                return contact.addressInfo.address === value;
              }
            }),
          });
        });
      }
      // flat contactIndexFilterList
      contactIndexFilterList.forEach(({ contacts }) => {
        contactFilterList.push(...contacts);
      });
      return { contactFilterList, contactIndexFilterList };
    },
    [contactIndexList],
  );
};

export const useIndexAndName = (item: Partial<IContactItemType>) => {
  return useMemo(() => {
    const name = item?.name;

    const index = name?.substring(0, 1).toLocaleUpperCase();
    return { index, name };
  }, [item?.name]);
};
