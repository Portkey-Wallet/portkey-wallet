import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import SimulatedInputBox from 'components/SimulatedInputBox';
import { DiscoverCmsListSection } from '../components/DiscoverCmsListSection';
import { defaultColors } from 'assets/theme';
import SafeAreaBox from 'components/SafeAreaBox';
import CustomHeader from 'components/CustomHeader';
import { BGStyles } from 'assets/theme/styles';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { DiscoverArchivedSection } from '../components/DiscoverArchivedSection';
import { useCheckAndInitNetworkDiscoverMap } from 'hooks/discover';
import { useFetchCurrentRememberMeBlackList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useFocusEffect } from '@react-navigation/native';
import Touchable from 'components/Touchable';

export default function DiscoverHome() {
  useCheckAndInitNetworkDiscoverMap();
  const fetchCurrentRememberMeBlackList = useFetchCurrentRememberMeBlackList();
  const qrScanPermissionAndToast = useQrScanPermissionAndToast();

  const RightDom = useMemo(
    () => (
      <Touchable
        style={styles.svgWrap}
        onPress={async () => {
          if (!(await qrScanPermissionAndToast())) return;
          navigationService.navigate('QrScanner');
        }}>
        <Svg icon="scan" size={pTd(22)} color={defaultColors.bg31} />
      </Touchable>
    ),
    [qrScanPermissionAndToast],
  );

  useFocusEffect(
    useCallback(() => {
      fetchCurrentRememberMeBlackList();
    }, [fetchCurrentRememberMeBlackList]),
  );

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={BGStyles.white}>
      <CustomHeader noLeftDom rightDom={RightDom} themeType="white" titleDom={'Discover'} />
      <SimulatedInputBox onClickInput={() => navigationService.navigate('DiscoverSearch')} />
      <ScrollView style={styles.container}>
        <DiscoverArchivedSection />
        <DiscoverCmsListSection />
      </ScrollView>
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.bg4,
    paddingTop: pTd(24),
    flex: 1,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  svgWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: pTd(16),
  },
});
