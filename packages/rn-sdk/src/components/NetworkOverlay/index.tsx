import React, { useCallback } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { TextL } from '@portkey-wallet/rn-components/components/CommonText';
import OverlayModal from '@portkey-wallet/rn-components/components/OverlayModal';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import CommonSvg from '@portkey-wallet/rn-components/components/Svg';
import { pTd } from 'utils/unit';
import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { BorderStyles } from 'assets/theme/styles';
import { NetworkList } from '@portkey-wallet/constants/constants-ca/network-mainnet';
import { ModalBody } from '@portkey-wallet/rn-components/components/ModalBody';
import ActionSheet from '@portkey-wallet/rn-components/components/ActionSheet';

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
  const press = useCallback(() => {
    OverlayModal.hide();
    if (isSelect) return;
    ActionSheet.alert({
      title: `You are about to switch to ${network.name}`,
      message: `Your account on the current network can not be used on ${network.name}, so you will need to register a new account or log in to your existing ${network.name} account there.`,
      buttons: [
        { title: 'Cancel', type: 'outline' },
        {
          title: 'Confirm',
          onPress: () => changeNetwork(network),
        },
      ],
    });
  }, [changeNetwork, isSelect, network]);
  return (
    <Touchable
      disabled={!network.isActive}
      onPress={press}
      style={[styles.itemRow, !network.isActive ? styles.disableItem : undefined]}
      key={network.name}>
      <CommonSvg size={32} icon={network.networkType === 'MAINNET' ? 'mainnet' : 'testnet'} />
      <View style={[styles.nameRow, BorderStyles.border4, !hideBorder ? styles.borderBottom1 : undefined]}>
        <TextL numberOfLines={1} style={styles.nameText}>
          {network.name}
        </TextL>
      </View>
      {isSelect && <CommonSvg iconStyle={styles.selectIconStyle} icon="selected" size={21} />}
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
