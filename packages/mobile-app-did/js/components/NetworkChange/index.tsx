import React, { memo, useCallback, useEffect, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import { useChangeNetwork } from 'hooks/network';
import { TextL, TextTitle } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { useTheme } from '@rneui/themed';
import { darkColors } from 'assets/theme';
import { bottomBarHeight } from '@portkey-wallet/utils/mobile/device';
import { useIsMainnet, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { NetworkItem } from '@portkey-wallet/types/types-ca/network';

let isAlertShowing = false;

interface NetworkChangeAlertProps {
  mainnetNetwork: NetworkItem;
  onSwitchToMainnet: (network: NetworkItem) => void;
}

function NetworkChangeAlert({ mainnetNetwork, onSwitchToMainnet }: NetworkChangeAlertProps) {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleSwitch = useCallback(async () => {
    setLoading(true);
    try {
      await onSwitchToMainnet(mainnetNetwork);
    } finally {
      setLoading(false);
      isAlertShowing = false;
      OverlayModal.hide();
    }
  }, [mainnetNetwork, onSwitchToMainnet]);

  return (
    <View style={styles.container}>
      <View style={styles.alertBox}>
        <View style={styles.alertHeader}>
          <View style={styles.alertHeaderBlock} />
        </View>
        <Svg iconStyle={styles.infoIcon} icon="info" size={pTd(32)} color={theme.colors.iconBase1} />
        <TextTitle style={styles.alertTitle}>Mainnet Only Support</TextTitle>
        <TextL style={styles.alertMessage}>
          Our blockchain wallet currently supports mainnet only. Testnet support is no longer available.
        </TextL>
        <View style={styles.buttonWrap}>
          <CommonButton
            type="primary"
            title="Switch to Mainnet"
            loading={loading}
            onPress={handleSwitch}
            buttonStyle={styles.button}
          />
        </View>
      </View>
    </View>
  );
}

const showNetworkChangeAlert = (onSwitchToMainnet: (network: NetworkItem) => void, mainnetNetwork: NetworkItem) => {
  if (isAlertShowing) {
    return;
  }
  isAlertShowing = true;

  Keyboard.dismiss();
  OverlayModal.show(<NetworkChangeAlert mainnetNetwork={mainnetNetwork} onSwitchToMainnet={onSwitchToMainnet} />, {
    modal: true,
    position: 'bottom',
    enabledCloseModalByScroll: false,
  });
};

function NetworkChangeChecker() {
  const isMainnet = useIsMainnet();
  const networkList = useNetworkList();
  const changeNetwork = useChangeNetwork({ key: 'tab', name: 'tab' });

  useEffect(() => {
    if (isMainnet) {
      isAlertShowing = false;
      return;
    }

    const timer = setTimeout(() => {
      if (isAlertShowing) {
        return;
      }
      const mainnetNetwork = networkList.find(network => network.networkType === 'MAINNET');
      if (mainnetNetwork) {
        showNetworkChangeAlert(network => changeNetwork(network, false), mainnetNetwork);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isMainnet, networkList, changeNetwork]);

  return null;
}

const NetworkChangeCheckerMemo = memo(NetworkChangeChecker);

export default {
  showNetworkChangeAlert,
};

export { NetworkChangeCheckerMemo as NetworkChangeChecker };

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkColors.bgBase1,
    paddingBottom: bottomBarHeight,
    borderTopWidth: pTd(1),
    borderTopColor: darkColors.bgBase3,
  },
  alertBox: {
    paddingHorizontal: pTd(20),
    paddingBottom: pTd(24),
  },
  alertHeader: {
    alignItems: 'center',
    paddingTop: pTd(6),
    paddingBottom: pTd(16),
  },
  alertHeaderBlock: {
    width: pTd(32),
    height: pTd(3),
    backgroundColor: darkColors.bgBase3,
    borderRadius: pTd(1),
  },
  infoIcon: {
    alignSelf: 'center',
    marginBottom: pTd(8),
  },
  alertTitle: {
    textAlign: 'center',
    marginBottom: pTd(8),
  },
  alertMessage: {
    textAlign: 'center',
    color: darkColors.textBase2,
    lineHeight: pTd(22),
  },
  buttonWrap: {
    marginTop: pTd(24),
  },
  button: {
    height: pTd(48),
  },
});
