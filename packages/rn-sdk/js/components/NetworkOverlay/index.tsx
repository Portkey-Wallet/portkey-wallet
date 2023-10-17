import React from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { TextL } from 'components/CommonText';
import OverlayModal from 'components/OverlayModal';
import { useCurrentNetworkInfo, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { BorderStyles } from 'assets/theme/styles';
// import { useChangeNetwork } from 'hooks/network';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { ModalBody } from 'components/ModalBody';

const showSwitchChain = () => {
  console.log('');
};

function Network({
  network,
  hideBorder,
  route,
}: {
  network: NetworkItem;
  hideBorder?: boolean;
  route: RouteProp<ParamListBase>;
}) {
  const currentNetworkInfo = useCurrentNetworkInfo();
  // const changeNetwork = useChangeNetwork(route);
  const isSelect = currentNetworkInfo.name === network.name;
  return (
    <Touchable
      disabled={!network.isActive}
      onPress={async () => {
        OverlayModal.hide();
        if (isSelect) return;
        // changeNetwork(network);
      }}
      style={[styles.itemRow, !network.isActive ? styles.disableItem : undefined]}
      key={network.name}>
      <Svg size={32} icon={network.networkType === 'MAIN' ? 'mainnet' : 'testnet'} />
      <View style={[styles.nameRow, BorderStyles.border4, !hideBorder ? styles.borderBottom1 : undefined]}>
        <TextL numberOfLines={1} style={styles.nameText}>
          {network.name}
        </TextL>
      </View>
      {isSelect && <Svg iconStyle={styles.selectIconStyle} icon="selected" size={21} />}
    </Touchable>
  );
}

function SwitchNetwork({ route }: { route: RouteProp<ParamListBase> }) {
  const networkList = useNetworkList();
  return (
    <ModalBody modalBodyType="bottom" title={'Switch Networks'}>
      {networkList.map((network, index) => (
        <Network route={route} hideBorder={index === networkList.length - 1} network={network} key={network.name} />
      ))}
    </ModalBody>
  );
}

const showSwitchNetwork = (route: RouteProp<ParamListBase>) => {
  Keyboard.dismiss();
  OverlayModal.show(<SwitchNetwork route={route} />, {
    position: 'bottom',
  });
};

export default {
  showSwitchChain,
  showSwitchNetwork,
};

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  itemRow: {
    height: 72,
    paddingLeft: pTd(20),
    alignItems: 'center',
    flexDirection: 'row',
  },
  disableItem: {
    opacity: 0.3,
  },
  nameRow: {
    flex: 1,
    marginLeft: pTd(12),
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
  borderBottom1: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  nameText: {
    flex: 1,
    marginRight: 50,
  },
  selectIconStyle: {
    position: 'absolute',
    right: pTd(22),
  },
});
