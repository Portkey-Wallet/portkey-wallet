import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, BorderStyles, FontStyles } from 'assets/theme/styles';
import { TextM, TextS, TextXXL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
// import { formatStr2EllipsisStr } from 'utils';
import { pTd } from 'utils/unit';

export interface ItemType {
  isShowChat?: boolean;
  contact: ContactItemType;
  onPress?: (item: any) => void;
  onPressChat?: (item: any) => void;
}

const ContactItem: React.FC<ItemType> = props => {
  const { isShowChat = false, contact, onPress, onPressChat } = props;

  return (
    <TouchableOpacity onPress={() => onPress?.(contact)}>
      <View style={styles.itemWrap}>
        <View style={[styles.itemAvatar, BGStyles.bg4, BorderStyles.border1]}>
          <TextXXL style={FontStyles.font5}>{contact.name[0].toUpperCase()}</TextXXL>
        </View>
        <View style={styles.itemNameWrap}>
          <TextM numberOfLines={1} style={FontStyles.font5}>
            {contact.name}
          </TextM>
        </View>
        {isShowChat && (
          <Touchable style={styles.chatButton} onPress={() => onPressChat?.(contact)}>
            <TextS style={FontStyles.font2}>Chat</TextS>
          </Touchable>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(ContactItem);

export const styles = StyleSheet.create({
  itemWrap: {
    backgroundColor: defaultColors.bg1,
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
    width: pTd(36),
    height: pTd(36),
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
  chatButton: {
    backgroundColor: defaultColors.bg5,
    borderRadius: pTd(6),
    overflow: 'hidden',
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(4),
  },
});
