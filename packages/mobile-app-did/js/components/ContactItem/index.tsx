import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, BorderStyles, FontStyles } from 'assets/theme/styles';
import { TextL, TextS, TextXXL } from 'components/CommonText';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
// import { formatStr2EllipsisStr } from 'utils';
import { pTd } from 'utils/unit';

export interface ItemType {
  isShowWarning?: boolean;
  isShowChat?: boolean;
  isShowContactIcon?: boolean;
  contact: ContactItemType;
  onPress?: (item: any) => void;
  onPressChat?: (item: any) => void;
}

const ContactItem: React.FC<ItemType> = props => {
  const { isShowChat = false, isShowWarning = false, isShowContactIcon = false, contact, onPress, onPressChat } = props;

  return (
    <TouchableOpacity onPress={() => onPress?.(contact)}>
      <View style={styles.itemWrap}>
        <View style={[styles.itemAvatar, BGStyles.bg4, BorderStyles.border1, styles.avatarWrap]}>
          {isShowWarning && <View style={styles.warningCycle} />}
          <TextXXL style={FontStyles.font5}>
            {(contact?.name || contact?.caHolderInfo?.walletName || contact.imInfo?.name)?.[0]?.toUpperCase()}
          </TextXXL>
        </View>
        <View style={styles.itemNameWrap}>
          <TextL numberOfLines={1} style={FontStyles.font5}>
            {contact?.name || contact?.caHolderInfo?.walletName || contact.imInfo?.name}
          </TextL>
          {isShowContactIcon && (
            <View style={[GStyles.marginTop(pTd(2)), GStyles.flexRow, styles.contactIconWrap]}>
              <Svg icon="chat-added" size={pTd(14)} color={defaultColors.primaryColor} />
              <TextS style={[FontStyles.font4, GStyles.marginLeft(pTd(4))]}>Contact</TextS>
            </View>
          )}
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
  avatarWrap: {
    position: 'relative',
  },
  warningCycle: {
    position: 'absolute',
    zIndex: 1000,
    right: 0,
    top: 0,
    width: pTd(8),
    height: pTd(8),
    borderRadius: pTd(4),
    backgroundColor: defaultColors.bg17,
    borderWidth: pTd(1),
    borderColor: defaultColors.bg1,
  },
  contactIconWrap: {
    width: pTd(76),
    paddingHorizontal: pTd(8),
    paddingVertical: pTd(2),
    borderRadius: pTd(4),
    backgroundColor: defaultColors.bg9,
  },
});
