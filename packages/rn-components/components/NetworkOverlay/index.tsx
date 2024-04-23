import React from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { TextL } from '../CommonText';
import OverlayModal from '../OverlayModal';
import { useCurrentNetworkInfo, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import Touchable from '../Touchable';
import Svg from '../Svg';
import { pTd } from '../../utils/unit';
import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { useChangeNetwork } from '@portkey-wallet/rn-base/hooks/network';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { ModalBody } from '../ModalBody';
import { BorderStyles } from '../../theme/styles';

const showSwitchChain = () => {
  console.log('');
};

function Network({
  network,
  hideBorder,
  route,
  onPress,
}: {
  network: NetworkItem;
  hideBorder?: boolean;
  route: RouteProp<ParamListBase>;
  onPress?: (network: NetworkItem) => void;
}) {
  const currentNetworkInfo = useCurrentNetworkInfo();
  const changeNetwork = useChangeNetwork(route);
  const isSelect = currentNetworkInfo.name === network.name;
  return (
    <Touchable
      disabled={!network.isActive}
      onPress={async () => {
        OverlayModal.hide();
        if (isSelect) return;
        if (onPress) {
          onPress(network);
          return;
        }
        changeNetwork(network);
      }}
      style={[styles.itemRow, !network.isActive ? styles.disableItem : undefined]}
      key={network.name}>
      {/* network icon is change, when network change */}
      <Svg size={32} icon={network.networkType === 'MAINNET' ? 'mainnet' : 'testnet'} />
      <View style={[styles.nameRow, BorderStyles.border4, !hideBorder ? styles.borderBottom1 : undefined]}>
        <TextL numberOfLines={1} style={styles.nameText}>
          {network.name}
        </TextL>
      </View>
      {isSelect && <Svg iconStyle={styles.selectIconStyle} icon="selected" size={21} />}
    </Touchable>
  );
}

function SwitchNetwork({
  route,
  onPress,
}: {
  route: RouteProp<ParamListBase>;
  onPress?: (network: NetworkItem) => void;
}) {
  const networkList = useNetworkList();
  return (
    <ModalBody modalBodyType="bottom" title={'Switch Networks'}>
      {networkList.map((network, index) => (
        <Network
          route={route}
          hideBorder={index === networkList.length - 1}
          network={network}
          key={network.name}
          onPress={onPress}
        />
      ))}
    </ModalBody>
  );
}

const showSwitchNetwork = (route: RouteProp<ParamListBase>, onPress?: (network: NetworkItem) => void) => {
  Keyboard.dismiss();
  OverlayModal.show(<SwitchNetwork route={route} onPress={onPress} />, {
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
