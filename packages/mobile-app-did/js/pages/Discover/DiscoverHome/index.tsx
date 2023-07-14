import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import SimulatedInputBox from 'components/SimulatedInputBox';
import { DiscoverCmsListSection } from '../components/DiscoverCmsListSection';
import { defaultColors } from 'assets/theme';
import SafeAreaBox from 'components/SafeAreaBox';
import CustomHeader from 'components/CustomHeader';
import { BGStyles } from 'assets/theme/styles';
import useQrScanPermission from 'hooks/useQrScanPermission';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import ActionSheet from 'components/ActionSheet';
import { useLanguage } from 'i18n/hooks';
import { DiscoverArchivedSection } from '../components/DiscoverArchivedSection';

export default function DiscoverHome() {
  const [, requestQrPermission] = useQrScanPermission();
  const { t } = useLanguage();

  const showDialog = useCallback(
    () =>
      ActionSheet.alert({
        title: t('Enable Camera Access'),
        message: t('Cannot connect to the camera. Please make sure it is turned on'),
        buttons: [
          {
            title: t('Close'),
            type: 'solid',
          },
        ],
      }),
    [t],
  );

  const RightDom = useMemo(
    () => (
      <TouchableOpacity
        style={styles.svgWrap}
        onPress={async () => {
          if (!(await requestQrPermission())) return showDialog();
          navigationService.navigate('QrScanner');
        }}>
        <Svg icon="scan" size={22} color={defaultColors.font2} />
      </TouchableOpacity>
    ),
    [requestQrPermission, showDialog],
  );

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={BGStyles.bg5}>
      <CustomHeader noLeftDom rightDom={RightDom} themeType="blue" titleDom={'Discover'} />
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
    padding: pTd(16),
  },
});
