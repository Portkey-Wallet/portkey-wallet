import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { defaultColors } from 'assets/theme';
import NFTAvatar from 'components/NFTAvatar';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { MintStatus } from '../MintStatusSection';
import Lottie from 'lottie-react-native';
import { commonStyles } from 'components/CommonInput/style';
import Svg from 'components/Svg';

interface MintStatusIconProps {
  status: MintStatus;
}

const MintStatusIcon = (props: MintStatusIconProps) => {
  const { status = MintStatus.Minted } = props;

  if (status === MintStatus.Minting)
    return (
      <View style={styles.iconWrap}>
        <Lottie style={commonStyles.loadingStyle} source={require('assets/lottieFiles/loading.json')} autoPlay loop />
      </View>
    );

  if (status === MintStatus.Minted) return <Svg icon="minted" size={pTd(40)} />;

  if (status === MintStatus.MintFailed) return <Svg icon="mintFail" size={pTd(40)} />;

  return null;
};

const styles = StyleSheet.create({
  iconWrap: {
    width: pTd(40),
    height: pTd(40),
    borderWidth: pTd(2),
    borderRadius: pTd(20),
    borderColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultColors.neutralContainerBG,
  },
});

export default MintStatusIcon;
