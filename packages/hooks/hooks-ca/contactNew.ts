import { request } from '@portkey-wallet/api/api-did';
import { CheckContactNameResponseType } from '@portkey-wallet/api/api-did/contact/type';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import {
  IAddContactItemApiType,
  IContactIndexType,
  IContactItemType,
  TDeteleContactItemParams,
  IEditContactItemApiType,
} from '@portkey-wallet/types/types-ca/contactNew';
import { useCallback, useEffect, useMemo } from 'react';
import {
  addContactActionNew,
  deleteContactActionNew,
  editContactActionNew,
  refreshContactMapNew,
  fetchContactListV2Async,
} from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppCommonDispatch, useAppCommonSelector } from '../index';
import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import { sleep } from '@portkey-wallet/utils';
import { useTransferNetworkConfig } from './config';
import { ChainId } from '@portkey-wallet/types';

export const REFRESH_DELAY_TIME = 1.5 * 1000;

export const useAddContact = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(
    async (contactItem: IAddContactItemApiType): Promise<IContactItemType> => {
      const response = await request.contact.createSaved({
        baseURL: currentNetworkInfo.apiUrl,
        params: contactItem,
      });
      dispatch(addContactActionNew(response));
      setTimeout(() => {
        dispatch(fetchContactListV2Async());
      }, REFRESH_DELAY_TIME);
      return response;
    },
    [currentNetworkInfo.apiUrl, dispatch],
  );
};

export const useEditContact = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(
    async (contactItem: IEditContactItemApiType): Promise<IContactItemType> => {
      const response = await request.contact.updateSaved({
        baseURL: currentNetworkInfo.apiUrl,
        params: contactItem,
      });
      dispatch(editContactActionNew(response));
      await sleep(REFRESH_DELAY_TIME);
      dispatch(fetchContactListV2Async());
      return response;
    },
    [currentNetworkInfo.apiUrl, dispatch],
  );
};

export const useDeleteContact = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(
    async (contactItem: TDeteleContactItemParams): Promise<IContactItemType> => {
      const response = await request.contact.deleteSaved({
        baseURL: currentNetworkInfo.apiUrl,
        params: contactItem,
      });
      dispatch(deleteContactActionNew({ ...contactItem, isDeleted: true } as IContactItemType));
      setTimeout(() => {
        dispatch(fetchContactListV2Async());
      }, REFRESH_DELAY_TIME);
      return response;
    },
    [currentNetworkInfo.apiUrl, dispatch],
  );
};

export const useCheckContactName = () => {
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(
    (contactName: string): Promise<CheckContactNameResponseType> => {
      return request.contact.checkSavedName({
        baseURL: currentNetworkInfo.apiUrl,
        params: {
          name: contactName,
        },
      });
    },
    [currentNetworkInfo.apiUrl],
  );
};

export const useContact = (isFetch = true, isInit = false) => {
  const dispatch = useAppCommonDispatch();
  useEffect(() => {
    isFetch && dispatch(fetchContactListV2Async(isInit));
  }, [dispatch, isFetch, isInit]);
  return useAppCommonSelector(state => state.contact);
};

export const useContactList = () => {
  const contact = useAppCommonSelector(state => state.contact);

  return useMemo(() => {
    let result: IContactItemType[] = [];
    const _list = contact?.contactIndexListNew || [];
    _list
      .filter(ele => ele.contacts.length !== 0)
      .map(ele => {
        result = [...result, ...ele.contacts];
      });
    return result;
  }, [contact?.contactIndexListNew]);
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
        if (!isFt && ele.addressInfo.network !== 'aelf') return false;
        if (ele.addressInfo.network === 'aelf') return true;

        return checkIsSupportTargetChain({ fromChainId, symbol: tokenId, network: ele.addressInfo.network });
      });

      return result;
    },
    [checkIsSupportTargetChain, contactList],
  );
};

export const useCheckContactMap = () => {
  const contact = useAppCommonSelector(state => state.contact);
  const dispatch = useAppCommonDispatch();

  useEffect(() => {
    if (contact.lastModified === 0) return;
    const contactMapLength = Object.keys(contact.contactMap).length;
    const contactRelationIdMapLength = Object.keys(contact.contactRelationIdMap || {}).length;
    const contactPortkeyIdMapLength = Object.keys(contact.contactPortkeyIdMap || {}).length;

    const contactIdMapLength = Object.keys(contact.contactIdMap || {}).length;
    if (
      contactMapLength === 0 ||
      contactRelationIdMapLength === 0 ||
      contactIdMapLength === 0 ||
      contactPortkeyIdMapLength === 0
    ) {
      dispatch(refreshContactMapNew());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useContactIdMap = () => {
  return useAppCommonSelector(state => state.contact.contactIdMapNew);
};
export const useContactPortkeyIdMap = () => {
  return useAppCommonSelector(state => state.contact.contactPortkeyIdMapNew);
};

export const useContactInfoById = ({ contactId }: { contactId?: string }) => {
  const contactIdMap = useContactIdMap();

  return useMemo(() => {
    let contactInfo: IContactItemType | undefined;
    // if (!relationId || !contactId) return undefined;
    if (contactId) {
      contactInfo = contactIdMap?.[contactId][0];
    }
    if (contactInfo) return contactInfo;

    return contactInfo;
  }, [contactId, contactIdMap]);
};

export const useAllContactList = () => {
  const { contactIndexList } = useContact();

  return useMemo(() => {
    return contactIndexList.filter(c => c.contacts.length > 0);
  }, [contactIndexList]);
};

export const useLocalContactSearch = () => {
  const { contactIndexListNew } = useContact(false, false);

  return useCallback(
    (value: string) => {
      // STEP 1 > filter - type
      const filterList: IContactIndexType[] = contactIndexListNew ?? [];

      // STEP 2 > filter - no data
      const notEmptyFilterList = filterList.filter(item => item?.contacts?.length > 0);

      // STEP 3 > filter - no search value, return total
      if (!value) {
        const temp: IContactItemType[] = [];
        notEmptyFilterList.forEach(({ contacts }) => {
          temp.push(...contacts);
        });
        return { contactFilterList: temp, contactIndexFilterList: notEmptyFilterList };
      }

      // STEP 4 > filter - have search value, return search result
      const contactIndexFilterList: IContactIndexType[] = [];
      const contactFilterList: IContactItemType[] = [];
      if (value.length <= 18) {
        const _v = value.trim().toLowerCase();
        notEmptyFilterList.forEach(({ index, contacts }) => {
          // Name search and Wallet Name search
          contactIndexFilterList.push({
            index,
            contacts: contacts.filter(contact => {
              return (
                contact?.name?.trim().toLowerCase().includes(_v) ||
                contact?.caHolderInfo?.walletName?.trim().toLowerCase().includes(_v)
              );
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
    [contactIndexListNew],
  );
};

export const useIndexAndName = (item: Partial<IContactItemType>) => {
  return useMemo(() => {
    const name = item?.name || item?.caHolderInfo?.walletName;

    const index = name?.substring(0, 1).toLocaleUpperCase();
    return { index, name };
  }, [item?.caHolderInfo?.walletName, item?.name]);
};
