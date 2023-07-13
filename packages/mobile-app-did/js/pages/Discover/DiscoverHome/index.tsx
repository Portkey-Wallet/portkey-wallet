import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import SimulatedInputBox from 'components/SimulatedInputBox';
import { DiscoverCmsListSection } from '../components/DiscoverCmsListSection';
import { DiscoverRecordListSection } from '../components/DiscoverRecordListSection';

import { defaultColors } from 'assets/theme';
import SafeAreaBox from 'components/SafeAreaBox';
import CustomHeader from 'components/CustomHeader';
import { BGStyles } from 'assets/theme/styles';
import useQrScanPermission from 'hooks/useQrScanPermission';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import ActionSheet from 'components/ActionSheet';
import { useLanguage } from 'i18n/hooks';

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

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={BGStyles.bg5}>
      <View style={styles.container}>
        <CustomHeader
          noLeftDom
          rightDom={
            <TouchableOpacity
              style={styles.svgWrap}
              onPress={async () => {
                if (!(await requestQrPermission())) return showDialog();
                navigationService.navigate('QrScanner');
              }}>
              <Svg icon="scan" size={22} color={defaultColors.font2} />
            </TouchableOpacity>
          }
          themeType="blue"
          titleDom={'Discover'}
        />
        <SimulatedInputBox onClickInput={() => navigationService.navigate('DiscoverSearch')} />
        <ScrollView>
          <DiscoverRecordListSection />
          <DiscoverCmsListSection />
        </ScrollView>
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
  svgWrap: {
    padding: pTd(16),
  },
});
