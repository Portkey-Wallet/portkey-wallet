import React, { useCallback, useMemo } from 'react';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import ListItem from 'components/ListItem';
import GStyles from 'assets/theme/GStyles';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import ChainOverlay from 'components/ChainOverlay';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';
import { makeStyles, useTheme } from '@rneui/themed';

interface SelectChainProps {
  currentNetwork: NetworkType;
  chainId: ChainId;
  chainList: IChainItemType[];
  onChainPress: (chainId: ChainId) => void;
}

const SelectChain: React.FC<SelectChainProps> = ({ currentNetwork, chainId, chainList, onChainPress }) => {
  const styles = getStyles();
  const { theme } = useTheme();
  const _chainList = useMemo(
    () =>
      chainList
        .map(ele => ({
          ...ele,
          // customChainName: formatChainInfoToShow(ele.chainId, currentNetwork),
          customChainName: formatChainInfoToShow(ele.chainId, 'MAINNET'),
        }))
        .reverse(),
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
      titleStyle={[GStyles.flexRowWrap, GStyles.itemCenter]}
      titleTextStyle={styles.chainSelectTitleStyle}
      style={styles.selectedItem}
      // title={formatChainInfoToShow(chainId, currentNetwork)}
      title={formatChainInfoToShow(chainId, 'MAINNET')}
      rightElement={<Svg size={pTd(16)} icon="down-arrow" color={theme.colors.iconBase1} />}
    />
  );
};

export default SelectChain;

const getStyles = makeStyles(theme => ({
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
    fontSize: pTd(16),
    color: theme.colors.textBase1,
  },
  selectedItem: {
    borderRadius: pTd(8),
    height: pTd(40),
    borderWidth: pTd(1),
  },
}));
