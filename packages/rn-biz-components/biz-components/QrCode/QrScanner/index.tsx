import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';

import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import { useFocusEffect, useIsFocused } from '@portkey-wallet/rn-inject-sdk';
import * as ImagePicker from 'expo-image-picker';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import { FontStyles } from '@portkey-wallet/rn-base/assets/theme/styles';
import { isIOS, screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';

import { Camera } from 'expo-camera';
import Loading from '@portkey-wallet/rn-components/components/Loading';
import { useHandleDataFromQrCode } from '@portkey-wallet/rn-base/hooks/useQrScan';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { sleep } from '@portkey-wallet/utils';
import { useLatestRef } from '@portkey-wallet/hooks';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
interface QrScannerProps {
  route?: any;
}

const QrScanner: React.FC<QrScannerProps> = () => {
  const { t } = useLanguage();

  const [refresh, setRefresh] = useState<boolean>();
  const handleDataFromQrCode = useHandleDataFromQrCode();

  const isFocused = useIsFocused();
  const latestIsFocused = useLatestRef(isFocused);
  useFocusEffect(
    useCallback(() => {
      (async () => {
        setRefresh(true);
        await sleep(10);
        setRefresh(false);
      })();
    }, []),
  );
  const lock = useRef(false);
  const handleBarCodeScanned = useLockCallback(
    async ({ data = '' }) => {
      if (!latestIsFocused.current) return;
      try {
        if (lock.current) {
          return;
        }
        lock.current = true;
        await handleDataFromQrCode(data);
      } catch (e) {
        await navigationService.navigate('QrCodeResult', { qrCodeStr: data });
      } finally {
        Loading.hide();
        lock.current = false;
      }
    },
    [handleDataFromQrCode, latestIsFocused],
  );

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (result.cancelled || !result.uri) return;

    if (result && result?.uri) {
      const scanResult = await BarCodeScanner.scanFromURLAsync(result?.uri, [BarCodeScanner.Constants.BarCodeType.qr]);

      if (scanResult[0]?.data) handleBarCodeScanned({ data: scanResult[0]?.data || '' });
    }
  };

  return (
    <View style={PageStyle.wrapper}>
      {refresh ? null : (
        <Camera
          ratio={'16:9'}
          style={[PageStyle.barCodeScanner, !isIOS && PageStyle.barCodeScannerAndroid]}
          onBarCodeScanned={handleBarCodeScanned}>
          <SafeAreaView style={PageStyle.innerView}>
            <View style={PageStyle.iconWrap}>
              <Text style={PageStyle.leftBlock} />
              <Touchable
                style={PageStyle.svgWrap}
                onPress={() => {
                  navigationService.goBack();
                }}>
                <Svg icon="close1" size={pTd(14)} iconStyle={PageStyle.icon} />
              </Touchable>
            </View>
            <Svg icon="scan-square" size={pTd(240)} iconStyle={PageStyle.scan} />
            <TextM style={PageStyle.tips}>{t('Receive code / Login code / URL code')}</TextM>

            <Touchable style={[PageStyle.albumWrap, GStyles.alignCenter]} onPress={selectImage}>
              <Svg icon="album" size={pTd(48)} />
              <TextM style={[FontStyles.font2, PageStyle.albumText]}>{t('Album')}</TextM>
            </Touchable>
          </SafeAreaView>
        </Camera>
      )}
    </View>
  );
};

export default QrScanner;

export const PageStyle = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
    backgroundColor: defaultColors.bgColor1,
  },
  barCodeScanner: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 100,
  },
  barCodeScannerAndroid: {
    width: screenWidth,
    height: screenHeight,
  },
  innerView: {
    width: '100%',
    height: '100%',
  },
  iconWrap: {
    marginTop: pTd(16),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  icon: {
    width: pTd(40),
  },
  svgWrap: {
    ...GStyles.paddingArg(16, 0, 16, 16),
  },
  scan: {
    marginTop: pTd(136),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  title: {
    marginTop: pTd(62),
    fontSize: pTd(16),
    color: defaultColors.font2,
    textAlign: 'center',
  },
  tips: {
    // position: 'absolute',
    // bottom: 100,
    color: defaultColors.font7,
    textAlign: 'center',
    width: screenWidth,
    lineHeight: pTd(20),
    marginTop: pTd(54),
  },
  albumWrap: {
    position: 'absolute',
    bottom: pTd(75),
  },
  albumText: {
    marginTop: pTd(4),
    textAlign: 'center',
  },
  leftBlock: {
    flex: 1,
  },
});
