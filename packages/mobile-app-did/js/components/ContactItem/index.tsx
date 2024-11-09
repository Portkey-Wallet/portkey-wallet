import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import { makeStyles } from '@rneui/themed';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import ContactAddress from 'components/ContactAddress';

export const formatStr2EllipsisStr = (address = '', startDigit = 8, endDigit = 8): string => {
  if (!address) return '';

  const pre = address.substring(0, startDigit);
  const suffix = address.substring(address.length - endDigit);
  return `${pre}...${suffix}`;
};
export interface ItemType {
  contact: IContactItemType;
  onPress?: (item: any) => void;
  onPressChat?: (item: any) => void;
  isShowChat?: boolean;
}

const ContactItem: React.FC<ItemType> = props => {
  const { contact, onPress } = props;
  const styles = getStyles();

  return (
    <Touchable onPress={() => onPress?.(contact)}>
      <View style={styles.itemWrap}>
        <View style={[styles.avatarWrap]}>
          <CommonAvatar
            resizeMode="cover"
            title={(contact?.name || contact?.caHolderInfo?.walletName)?.toUpperCase()}
            avatarSize={pTd(42)}
            imageUrl={contact.caHolderInfo?.avatar || ''}
            style={styles.itemAvatar}
            titleStyle={styles.itemAvatarTitle}
          />
          {contact.addressInfo.networkImage && (
            <Image source={{ uri: contact.addressInfo.networkImage }} style={styles.avatarNetworkIcon} />
          )}
        </View>
        <View style={styles.itemNameWrap}>
          <View style={GStyles.flexRow}>
            <TextL numberOfLines={1} style={[styles.itemNameText]}>
              {contact?.name || contact?.caHolderInfo?.walletName}
            </TextL>
          </View>
          <ContactAddress contact={contact} style={styles.itemAddressText} />
        </View>
      </View>
    </Touchable>
  );
};

export default memo(ContactItem);

export const getStyles = makeStyles(theme => ({
  itemWrap: {
    height: pTd(66),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    ...GStyles.paddingArg(12, 16),
  },
  itemAvatar: {
    backgroundColor: theme.colors.iconBrand2,
  },
  itemAvatarTitle: {
    color: theme.colors.textBrand4,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  itemNameWrap: {
    flex: 1,
  },
  itemNameText: {
    color: theme.colors.textBase1,
    lineHeight: pTd(22),
  },
  itemAddressText: {
    color: theme.colors.textBase2,
    lineHeight: pTd(20),
    fontSize: pTd(14),
  },
  avatarWrap: {
    position: 'relative',
    width: pTd(42),
    height: pTd(42),
    marginRight: pTd(10),
  },
  avatarNetworkIcon: {
    position: 'absolute',
    right: pTd(-5),
    bottom: pTd(-2),
    width: pTd(20),
    height: pTd(20),
    borderColor: theme.colors.borderBase1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: pTd(10),
  },
}));
