import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import { makeStyles } from '@rneui/themed';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo } from 'react';
import { View } from 'react-native';
import { pTd } from 'utils/unit';

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
        <View style={[styles.itemAvatar, styles.avatarWrap]}>
          <CommonAvatar
            hasBorder
            resizeMode="cover"
            title={(contact?.name || contact?.caHolderInfo?.walletName || contact.imInfo?.name)?.toUpperCase()}
            avatarSize={pTd(36)}
            imageUrl={contact.avatar || ''}
            style={styles.itemAvatar}
          />
        </View>
        <View style={styles.itemNameWrap}>
          <View style={GStyles.flexRow}>
            <TextL numberOfLines={1} style={[FontStyles.font5, styles.itemNameText]}>
              {contact?.name || contact?.caHolderInfo?.walletName || contact.imInfo?.name}
            </TextL>
            {/* {contact?.contactType === ContactType.ChatGptBot && <AIChatMark containerStyle={styles.aiMark} />} */}
          </View>
          <TextL style={[FontStyles.font5, styles.itemAddressText]}>address</TextL>
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
    marginRight: pTd(8),
  },
  itemNameWrap: {
    flex: 1,
  },
  itemNameText: {
    color: theme.colors.textBase1,
  },
  itemAddressText: {
    color: theme.colors.textBase2,
  },
  avatarWrap: {
    position: 'relative',
  },
}));
