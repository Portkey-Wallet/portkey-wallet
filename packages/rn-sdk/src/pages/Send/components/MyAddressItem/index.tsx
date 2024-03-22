import { ChainId } from '@portkey/provider-types';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextS, TextM } from '@portkey-wallet/rn-components/components/CommonText';
import { useCurrentNetworkType } from 'model/hooks/network';
import { addressFormat, formatStr2EllipsisStr, formatChainInfoToShow } from '@portkey-wallet/utils';
import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

export interface ItemType {
  chainId: ChainId;
  address: string;
  onPress?: (item: any) => void;
}

const RecentContactItem: React.FC<ItemType> = props => {
  const { chainId, address, onPress } = props;
  const currentNetwork = useCurrentNetworkType();

  return (
    <TouchableOpacity
      style={styles.itemWrap}
      onPress={() => {
        onPress?.({ address: addressFormat(address, chainId), name: '' });
      }}>
      <TextM>{formatStr2EllipsisStr(addressFormat(address, chainId), 10)}</TextM>
      <TextS style={styles.chainInfo1}>{formatChainInfoToShow(chainId, currentNetwork)}</TextS>
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
  chainInfo1: {
    marginTop: pTd(4),
    color: defaultColors.font3,
  },
  contactActivity: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});
