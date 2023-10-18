import React from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { TextL } from 'components/CommonText';
import OverlayModal from 'components/OverlayModal';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { BorderStyles } from 'assets/theme/styles';
import { NetworkList } from '@portkey-wallet/constants/constants-ca/network-mainnet';
import { ModalBody } from 'components/ModalBody';

function Network({
  network,
  hideBorder,
  isSelect,
  changeNetwork,
}: {
  network: NetworkItem;
  hideBorder?: boolean;
  isSelect: boolean;
  changeNetwork: (network: NetworkItem) => void;
}) {
  return (
    <Touchable
      disabled={!network.isActive}
      onPress={async () => {
        OverlayModal.hide();
        if (isSelect) return;
        changeNetwork(network);
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

function SwitchNetwork({
  currentNetwork,
  changeCurrentNetwork,
}: {
  currentNetwork: NetworkItem | undefined;
  changeCurrentNetwork: (network: NetworkItem) => void;
}) {
  return (
    <ModalBody modalBodyType="bottom" title={'Switch Networks'}>
      {NetworkList.map((network, index) => (
        <Network
          hideBorder={index === NetworkList.length - 1}
          network={network}
          key={network.name}
          isSelect={currentNetwork?.name === network.name}
          changeNetwork={changeCurrentNetwork}
        />
      ))}
    </ModalBody>
  );
}

const showSwitchNetwork = ({
  currentNetwork,
  changeCurrentNetwork,
}: {
  currentNetwork: NetworkItem | undefined;
  changeCurrentNetwork: (network: NetworkItem) => void;
}) => {
  Keyboard.dismiss();
  OverlayModal.show(<SwitchNetwork currentNetwork={currentNetwork} changeCurrentNetwork={changeCurrentNetwork} />, {
    position: 'bottom',
  });
};

export default {
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
