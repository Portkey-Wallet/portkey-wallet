import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextS } from 'components/CommonText';
import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { addressFormat } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';

export interface ItemType {
  chainId: ChainId;
  address: string;
  onPress?: (item: any) => void;
}

const RecentContactItem: React.FC<ItemType> = props => {
  const { chainId, address, onPress } = props;

  return (
    <TouchableOpacity
      style={styles.itemWrap}
      onPress={() => {
        onPress?.({ address: addressFormat(address, chainId), name: '' });
      }}>
      <TextS style={styles.address}>{addressFormat(address, chainId)}</TextS>
    </TouchableOpacity>
  );
};

export default memo(RecentContactItem);

export const styles = StyleSheet.create({
  itemWrap: {
    width: '100%',
    ...GStyles.paddingArg(20, 20),
    borderBottomColor: defaultColors.bg7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: defaultColors.bg1,
  },
  address: {},
});
