import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import { makeStyles, useTheme } from '@rneui/themed';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import ContactAddress from 'components/ContactAddress';
import Svg from 'components/Svg';
export interface ItemType {
  contact: IContactItemType;
  onPress?: (item: any) => void;
  isSaved?: boolean;
  showInfoIcon?: boolean;
  onInfoIconPress?: (item: any) => void;
}

const ContactItem: React.FC<ItemType> = props => {
  const { contact, onPress, isSaved = true, showInfoIcon = false, onInfoIconPress } = props;
  const styles = getStyles();

  const {
    theme: { colors },
  } = useTheme();

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
          {isSaved ? (
            <>
              <TextL numberOfLines={1} style={[styles.primaryText]}>
                {contact?.name || contact?.caHolderInfo?.walletName}
              </TextL>
              <ContactAddress contact={contact} style={styles.secondaryText} />
            </>
          ) : (
            <>
              <ContactAddress contact={contact} style={styles.primaryText} />
              <TextL style={styles.secondaryText}>{contact?.addressInfo?.networkName}</TextL>
            </>
          )}
        </View>
        {showInfoIcon && (
          <Touchable onPress={onInfoIconPress}>
            <Svg icon="info" size={pTd(24)} color={colors.iconBase1} />
          </Touchable>
        )}
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
    alignItems: 'flex-start',
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
  primaryText: {
    color: theme.colors.textBase1,
    lineHeight: pTd(22),
  },
  secondaryText: {
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
