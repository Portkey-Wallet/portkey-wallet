import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useRoute } from '@react-navigation/native';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextM } from 'components/CommonText';
import NetworkOverlay from 'components/NetworkOverlay';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import React from 'react';
import { pTd } from 'utils/unit';
import styles from '../styles';
import { useTheme } from '@rneui/themed';

export default function SwitchNetwork() {
  const route = useRoute();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const { theme } = useTheme();
  return (
    <Touchable
      onPress={() => {
        console.log('wfs useTheme SwitchNetwork', theme);
        NetworkOverlay.showSwitchNetwork(route);
      }}
      style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.networkRow]}>
      <TextM style={[FontStyles.font2, styles.networkTip]}>{currentNetworkInfo.name}</TextM>
      <Svg size={pTd(16)} icon="down-arrow" color={FontStyles.font2.color} />
    </Touchable>
  );
}
