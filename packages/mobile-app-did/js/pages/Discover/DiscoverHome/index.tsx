import React from 'react';
import { StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import SimulatedInputBox from '../components/SimulatedInputBox';
import { DiscoverCmsListSection } from '../components/DiscoverCmsListSection';
import { defaultColors } from 'assets/theme';
import SafeAreaBox from 'components/SafeAreaBox';
import CustomHeader from 'components/CustomHeader';
import { BGStyles } from 'assets/theme/styles';

export default function DiscoverHome() {
  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={BGStyles.bg5}>
      <View style={styles.container}>
        <CustomHeader themeType="blue" titleDom={'Discover'} noLeftDom />
        <SimulatedInputBox onClickInput={() => navigationService.navigate('DiscoverSearch')} />
        <DiscoverCmsListSection />
      </View>
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.bg4,
    flex: 1,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
});
