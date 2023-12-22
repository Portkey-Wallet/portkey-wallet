import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import AddressInput from 'components/AddressInput';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';

import { FontStyles } from 'assets/theme/styles';
import Touchable from 'components/Touchable';
import ListItem from 'components/ListItem';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { EditAddressType } from '../..';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

interface ContactAddressProps {
  editAddressItem: EditAddressType;
  editAddressIdx: number;
  isDeleteShow?: boolean;
  onDelete?: (editAddressIdx: number, editAddressItem: EditAddressType) => void;
  chainName?: string;
  onChainPress?: (editAddressIdx: number, editAddressItem: EditAddressType) => void;
  addressValue?: string;
  affix?: [string, string];
  onAddressChange?: (value: string, editAddressIdx: number, editAddressItem: EditAddressType) => void;
}

const ContactAddress: React.FC<ContactAddressProps> = ({
  editAddressItem,
  editAddressIdx,
  isDeleteShow = true,
  onDelete,
  chainName = '',
  onChainPress,
  addressValue,
  affix,
  onAddressChange,
}) => {
  const { t } = useLanguage();
  const isMainnet = useIsMainnet();

  const _onDelete = useCallback(() => {
    onDelete && onDelete(editAddressIdx, editAddressItem);
  }, [editAddressIdx, editAddressItem, onDelete]);

  const _onChainPress = useCallback(() => {
    onChainPress && onChainPress(editAddressIdx, editAddressItem);
  }, [editAddressIdx, editAddressItem, onChainPress]);

  const _onAddressChange = useCallback(
    (value: string) => {
      onAddressChange && onAddressChange(value, editAddressIdx, editAddressItem);
    },
    [editAddressIdx, editAddressItem, onAddressChange],
  );

  return (
    <View style={GStyles.marginBottom(6)}>
      <View style={styles.addressHeader}>
        <TextM style={[FontStyles.font3, styles.addressTitle]}>Address</TextM>
        {isDeleteShow && (
          <Touchable onPress={_onDelete}>
            <Svg icon="delete" size={pTd(16)} />
          </Touchable>
        )}
      </View>
      <ListItem
        onPress={_onChainPress}
        titleLeftElement={<Svg icon={isMainnet ? 'mainnet' : 'testnet'} size={pTd(28)} />}
        titleStyle={[GStyles.flexRowWrap, GStyles.itemCenter]}
        titleTextStyle={styles.chainSelectTitleStyle}
        style={styles.selectedItem}
        title={chainName}
        rightElement={<Svg size={pTd(16)} icon="right-arrow" color={defaultColors.icon1} />}
      />
      <AddressInput
        placeholder={t("Enter contact's address")}
        value={addressValue}
        affix={affix}
        onChangeText={_onAddressChange}
        errorMessage={editAddressItem.error.isError ? editAddressItem.error.errorMsg : ''}
      />
    </View>
  );
};

export default ContactAddress;

const styles = StyleSheet.create({
  addressHeader: {
    flexDirection: 'row',
    height: pTd(20),
    justifyContent: 'space-between',
    alignItems: 'center',
    ...GStyles.marginArg(0, 10, 8),
  },
  addressTitle: {
    lineHeight: pTd(20),
  },
  chainSelectTitleStyle: {
    marginLeft: pTd(8),
    fontSize: pTd(14),
  },
  selectedItem: {
    marginBottom: pTd(12),
    borderRadius: pTd(6),
    height: pTd(56),
  },
});
