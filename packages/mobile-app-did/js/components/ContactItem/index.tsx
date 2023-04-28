import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, BorderStyles, FontStyles } from 'assets/theme/styles';
import { TextM, TextXXL } from 'components/CommonText';
import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
// import { formatStr2EllipsisStr } from 'utils';
import { pTd } from 'utils/unit';

export interface ItemType {
  contact: ContactItemType;
  onPress?: (item: any) => void;
}

const ContactItem: React.FC<ItemType> = props => {
  const { contact, onPress } = props;

  return (
    <TouchableOpacity onPress={() => onPress?.(contact)}>
      <View style={styles.itemWrap}>
        <View style={[styles.itemAvatar, BGStyles.bg4, BorderStyles.border1]}>
          <TextXXL style={FontStyles.font5}>{contact.index}</TextXXL>
        </View>
        <View style={styles.itemNameWrap}>
          <TextM style={FontStyles.font5}>{contact.name}</TextM>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ContactItem);

export const styles = StyleSheet.create({
  itemWrap: {
    height: pTd(72),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    ...GStyles.paddingArg(0, 20),
  },
  itemAvatar: {
    width: pTd(40),
    height: pTd(40),
    borderRadius: pTd(20),
    marginRight: pTd(12),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  itemNameWrap: {
    flex: 1,
  },
});
