import { useCallback, useMemo } from 'react';
import { useAppCASelector } from '.';
import { useCurrentNetworkInfo } from './network';
import { request } from '@portkey-wallet/api/api-did';
import { useAppCommonDispatch } from '../index';
import { setContactPrivacyList, updateContactPrivacy } from '@portkey-wallet/store/store-ca/security/actions';
import { IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';

export const useSecurityState = () => useAppCASelector(state => state.security);
export const useContactPrivacyListNetMap = () => useAppCASelector(state => state.security.contactPrivacyListNetMap);

export const useContactPrivacyList = () => {
  const contactPrivacyListNetMap = useContactPrivacyListNetMap();
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const list = useMemo(() => contactPrivacyListNetMap[networkType] || [], [contactPrivacyListNetMap, networkType]);

  const refresh = useCallback(async () => {
    const result = await request.contact.contactPrivacyList();
    if (result?.permissions && Array.isArray(result.permissions)) {
      dispatch(
        setContactPrivacyList({
          network: networkType,
          list: result.permissions,
        }),
      );
    } else {
      throw result;
    }
  }, [dispatch, networkType]);

  const update = useCallback(
    async (value: IContactPrivacy) => {
      await request.contact.updateContactPrivacy({
        params: {
          identifier: value.identifier,
          privacyType: value.privacyType,
          permission: value,
        },
      });
      dispatch(
        updateContactPrivacy({
          network: networkType,
          value,
        }),
      );
    },
    [dispatch, networkType],
  );

  return {
    list,
    refresh,
    update,
  };
};
