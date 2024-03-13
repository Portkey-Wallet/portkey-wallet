import { useContext } from 'react';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextM } from 'components/CommonText';
import NetworkOverlay from 'components/NetworkOverlay';
import CommonSvg from 'components/Svg';
import Touchable from 'components/Touchable';
import React from 'react';
import { pTd } from 'utils/unit';
import styles from '../styles';
import NetworkContext from '../context/NetworkContext';

export default function SwitchNetwork() {
  const networkContext = useContext(NetworkContext);
  return (
    <Touchable
      onPress={() =>
        NetworkOverlay.showSwitchNetwork({
          currentNetwork: networkContext.currentNetwork,
          changeCurrentNetwork: networkContext.changeCurrentNetwork,
        })
      }
      style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.networkRow]}>
      <TextM style={[FontStyles.font11, styles.networkTip]}>{networkContext.currentNetwork?.name}</TextM>
      <CommonSvg size={pTd(16)} icon="down-arrow" color={FontStyles.font11.color} />
    </Touchable>
  );
}
