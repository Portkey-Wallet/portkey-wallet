import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import { TextS, TextM } from '@portkey-wallet/rn-components/components/CommonText';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';

export interface ItemType {
  chainId: ChainId;
  address: string;
  onPress?: (item: any) => void;
}

const RecentContactItem: React.FC<ItemType> = props => {
  const { chainId, address, onPress } = props;
  const { currentNetwork } = useWallet();

  return (
    <Touchable
      style={styles.itemWrap}
      onPress={() => {
        onPress?.({ address: addressFormat(address, chainId), name: '' });
      }}>
      <TextM>{formatStr2EllipsisStr(addressFormat(address, chainId), 10)}</TextM>
      <TextS style={styles.chainInfo1}>{formatChainInfoToShow(chainId, currentNetwork)}</TextS>
    </Touchable>
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
