import { defaultColors } from 'assets/theme';
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
      <Lottie
        style={commonStyles.loadingStyle}
        source={require('../../../../assets/lottieFiles/loading.json')}
        autoPlay
        loop
      />
    );

  if (status === MintStatus.Minted)
    return (
      <View style={[styles.iconShade, styles.borderRadios]}>
        <Svg icon="minted" size={pTd(20)} />
      </View>
    );

  if (status === MintStatus.MintFailed) return <Svg icon="error" size={pTd(32)} />;

  return null;
};

const styles = StyleSheet.create({
  iconShade: {
    shadowOffset: { width: 0, height: 4 },
    backgroundColor: defaultColors.bg1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  borderRadios: {
    borderRadius: pTd(20),
  },
});

export default MintStatusIcon;
