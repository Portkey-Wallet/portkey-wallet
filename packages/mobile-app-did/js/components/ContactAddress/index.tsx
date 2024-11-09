import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import { makeStyles } from '@rneui/themed';
import { addressFormat } from '@portkey-wallet/utils';
import React, { useImperativeHandle, useMemo, forwardRef } from 'react';
import { Text, TextStyle } from 'react-native';
import { AELF_NETWORK_NAME } from 'constants/common';

export const formatStr2EllipsisStr = (address = '', startDigit = 8, endDigit = 8): string => {
  if (!address) return '';

  const pre = address.substring(0, startDigit);
  const suffix = address.substring(address.length - endDigit);
  return `${pre}...${suffix}`;
};
export interface ItemType {
  contact: IContactItemType;
  style?: TextStyle;
}

export interface IContactAddressRef {
  getAddress: () => string;
}

const ContactAddress = forwardRef<IContactAddressRef, ItemType>((props, ref) => {
  const { contact, style } = props;

  const addressFormatStr = useMemo(() => {
    const { address, chainId, network } = contact?.addressInfo ?? {};
    if (network === AELF_NETWORK_NAME) {
      return addressFormat(address, chainId, network);
    }
    return address;
  }, [contact]);

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

  return <Text style={[style]}>{addressEllipsisStr}</Text>;
});
ContactAddress.displayName = 'ContactAddress';
export default ContactAddress;

export const getStyles = makeStyles(theme => ({}));
