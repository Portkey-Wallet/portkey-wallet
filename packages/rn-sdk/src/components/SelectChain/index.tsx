import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import { pTd } from 'utils/unit';
import ListItem from '@portkey-wallet/rn-components/components/ListItem';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { NetworkType, ChainId, ChainItemType } from '@portkey/provider-types';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { useCurrentNetworkType } from 'model/hooks/network';
import ChainOverlay from 'components/ChainOverlay';

interface SelectChainProps {
  currentNetwork: NetworkType;
  chainId: ChainId;
  chainList: ChainItemType[];
  onChainPress: (chainId: ChainId) => void;
}

const SelectChain: React.FC<SelectChainProps> = ({ currentNetwork, chainId, chainList, onChainPress }) => {
  const networkType = useCurrentNetworkType();

  const _chainList = useMemo(
    () =>
      chainList.map(ele => ({
        ...ele,
        customChainName: formatChainInfoToShow(ele.chainId, currentNetwork),
      })),
    [chainList, currentNetwork],
  );
  const onPressItem = useCallback(() => {
    ChainOverlay.showList({
      list: _chainList,
      value: chainId,
      labelAttrName: 'customChainName',
      callBack: item => {
        onChainPress(item.chainId);
      },
    });
  }, [_chainList, chainId, onChainPress]);

  return (
    <ListItem
      onPress={onPressItem}
      titleLeftElement={
        networkType === 'MAINNET' ? <Svg icon="mainnet" size={pTd(28)} /> : <Svg icon="testnet" size={pTd(28)} />
      }
      titleStyle={[GStyles.flexRowWrap, GStyles.itemCenter]}
      titleTextStyle={styles.chainSelectTitleStyle}
      style={styles.selectedItem}
      title={formatChainInfoToShow(chainId, currentNetwork)}
      rightElement={<Svg size={pTd(16)} icon="right-arrow" color={defaultColors.icon1} />}
    />
  );
};

export default SelectChain;

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
    borderRadius: pTd(6),
    height: pTd(56),
  },
});
