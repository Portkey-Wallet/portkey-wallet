import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import { addressFormat } from '@portkey-wallet/utils';
import { useImperativeHandle, useMemo, forwardRef } from 'react';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { AELF_NETWORK_NAME } from '@portkey-wallet/constants/constants-ca/common';

export const formatStr2EllipsisStr = (address = '', startDigit = 8, endDigit = 8): string => {
  if (!address) {
    return '';
  }

  const pre = address.substring(0, startDigit);
  const suffix = address.substring(address.length - endDigit);
  return `${pre}...${suffix}`;
};
export interface ItemType {
  contact: IContactItemType;
  ignoreFormat?: boolean;
  className?: string;
}

export interface IContactAddressRef {
  getAddress: () => string;
}

const ContactAddress = forwardRef<IContactAddressRef, ItemType>((props, ref) => {
  const { contact, className, ignoreFormat = false } = props;

  const addressFormatStr = useMemo(() => {
    const { address, chainId, network, isExchange } = contact?.addressInfo ?? {};
    if (ignoreFormat) {
      return address;
    }
    if (network === AELF_NETWORK_NAME) {
      if (isExchange && chainId === MAIN_CHAIN_ID) {
        return address;
      }
      return addressFormat(address, chainId, network);
    }
    return address;
  }, [contact, ignoreFormat]);

  const addressEllipsisStr = useMemo(() => {
    const { network } = contact?.addressInfo ?? {};
    if (network === AELF_NETWORK_NAME) {
      return formatStr2EllipsisStr(addressFormatStr, 8, 9);
    }
    return formatStr2EllipsisStr(addressFormatStr, 6, 4);
  }, [contact, addressFormatStr]);

  useImperativeHandle(ref, () => ({
    getAddress: () => addressFormatStr,
  }));

  return <span className={className}>{addressEllipsisStr}</span>;
});
ContactAddress.displayName = 'ContactAddress';
export default ContactAddress;
