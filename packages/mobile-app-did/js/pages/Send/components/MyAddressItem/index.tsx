import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextS, TextM } from 'components/CommonText';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';

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
