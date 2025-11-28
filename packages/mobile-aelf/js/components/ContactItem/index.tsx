import { IContactItemType } from '@portkey-wallet/types/types-eoa/contact';
import { makeStyles, useTheme } from '@rneui/themed';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo, useMemo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import ContactAddress from 'components/ContactAddress';
import Svg from 'components/Svg';
import { useContactNetworkConfig } from '@portkey-wallet/hooks/hooks-eoa/config';
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
  const { supportNetworkList } = useContactNetworkConfig();

  const {
    theme: { colors },
  } = useTheme();

  const imgUri = useMemo(
    () =>
      contact.addressInfo.networkImage ||
      supportNetworkList?.find(
        item => item.network === contact.addressInfo.network && item.chainId === contact.addressInfo.chainId,
      )?.imageUrl,
    [contact.addressInfo.chainId, contact.addressInfo.network, contact.addressInfo.networkImage, supportNetworkList],
  );

  console.log('imgUri', contact, imgUri);

  return (
    <Touchable onPress={() => onPress?.(contact)}>
      <View style={styles.itemWrap}>
        <View style={[styles.avatarWrap]}>
          <CommonAvatar
            resizeMode="cover"
            title={(contact?.name || '')?.toUpperCase()}
            avatarSize={pTd(42)}
            imageUrl={''}
            style={styles.itemAvatar}
            titleStyle={styles.itemAvatarTitle}
          />
          {imgUri && <Image source={{ uri: imgUri }} style={styles.avatarNetworkIcon} />}
        </View>
        <View style={styles.itemNameWrap}>
          {isSaved ? (
            <>
              <TextL numberOfLines={1} style={[styles.primaryText]}>
                {contact?.name || ''}
              </TextL>
              <ContactAddress contact={contact} style={styles.secondaryText} />
            </>
          ) : (
            <>
              <ContactAddress contact={contact} style={styles.primaryText} ignoreFormat={!isSaved} />
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
    backgroundColor: theme.colors.iconBrandDefault,
  },
  itemAvatarTitle: {
    color: theme.colors.textBrandOn,
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
