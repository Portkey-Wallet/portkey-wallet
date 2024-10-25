import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useRoute } from '@react-navigation/native';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';
import NetworkOverlay from 'components/NetworkOverlay';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import React, { useMemo } from 'react';
import { pTd } from 'utils/unit';
import { StyleSheet } from 'react-native';

export default function SwitchNetwork() {
  const route = useRoute();
  const currentNetworkInfo = useCurrentNetworkInfo();

  const networkName = useMemo(() => (currentNetworkInfo.name || '').replaceAll('aelf ', ''), [currentNetworkInfo.name]);

  return (
    <Touchable
      onPress={() => NetworkOverlay.showSwitchNetwork(route)}
      style={[GStyles.flexRow, GStyles.itemCenter, styles.networkSwitchWrap]}>
      <Svg icon={'change'} size={pTd(24)} iconStyle={GStyles.marginRight(4)} />
      <TextL>{networkName}</TextL>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  networkSwitchWrap: {
    paddingHorizontal: pTd(16),
  },
});
