import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useRoute } from '@react-navigation/native';
import GStyles from '@portkey-wallet/rn-components/theme/GStyles';
import { FontStyles } from '@portkey-wallet/rn-components/theme/styles';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import NetworkOverlay from '@portkey-wallet/rn-components/components/NetworkOverlay';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import React from 'react';
import { pTd } from '@portkey-wallet/rn-components/utils/unit';
import styles from '../styles';

export default function SwitchNetwork() {
  const route = useRoute();
  const currentNetworkInfo = useCurrentNetworkInfo();
  return (
    <Touchable
      onPress={() => NetworkOverlay.showSwitchNetwork(route)}
      style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.networkRow]}>
      <TextM style={[FontStyles.font11, styles.networkTip]}>{currentNetworkInfo.name}</TextM>
      <Svg size={pTd(16)} icon="down-arrow" color={FontStyles.font11.color} />
    </Touchable>
  );
}
