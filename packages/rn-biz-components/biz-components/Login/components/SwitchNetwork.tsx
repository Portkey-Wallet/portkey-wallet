import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useRoute } from '@portkey-wallet/rn-inject-sdk';
import GStyles from '@portkey-wallet/rn-components/theme/GStyles';
import { FontStyles } from '@portkey-wallet/rn-components/theme/styles';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import NetworkOverlay from '@portkey-wallet/rn-components/components/NetworkOverlay';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import React from 'react';
import { pTd } from '@portkey-wallet/rn-components/utils/unit';
import styles from '../styles';
import { NetworkItem } from '@portkey-wallet/types/types-ca/network';

export default function SwitchNetwork(props: { onPress?: (network: NetworkItem) => void }) {
  const { onPress } = props;
  const route = useRoute();
  const currentNetworkInfo = useCurrentNetworkInfo();
  return (
    <Touchable
      onPress={() => NetworkOverlay.showSwitchNetwork(route, onPress)}
      style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.networkRow]}>
      <TextM style={[FontStyles.font11, styles.networkTip]}>{currentNetworkInfo.name}</TextM>
      <Svg size={pTd(16)} icon="down-arrow" color={FontStyles.font11.color} />
    </Touchable>
  );
}
