import React, { useCallback, useState } from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';

import { useLanguage } from 'i18n/hooks';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { TextM } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { isIOS, screenHeight, screenWidth } from '@portkey-wallet/utils-mobile/device';

import { CameraView, Camera } from 'expo-camera';
import Loading from 'components/Loading';
import { useHandleDataFromQrCode } from 'hooks/useQrScan';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { sleep } from '@portkey-wallet/utils';
import { useLatestRef } from '@portkey-wallet/hooks';
import Touchable from 'components/Touchable';
import { makeStyles } from '@rneui/themed';

interface QrScannerProps {
  route?: any;
}

const QrScanner: React.FC<QrScannerProps> = () => {
  const { t } = useLanguage();

  const PageStyle = getStyles();

  const [refresh, setRefresh] = useState<boolean>();
  const handleDataFromQrCode = useHandleDataFromQrCode();

  const isFocused = useIsFocused();

  const latestIsFocused = useLatestRef(isFocused);
  useFocusEffect(
    useCallback(() => {
      (async () => {
        setRefresh(true);
        await sleep(isIOS ? 300 : 10);
        setRefresh(false);
      })();
    }, []),
  );

  const handleBarCodeScanned = useLockCallback(
    async ({ data = '' }) => {
      if (!latestIsFocused.current) {
        return;
      }
      try {
        await handleDataFromQrCode(data);
      } catch {
        navigationService.navigate('QrCodeResult', { qrCodeStr: data });
      } finally {
        Loading.hide();
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
    if (result.canceled || !result.assets || result.assets.length <= 0) {
      return;
    }

    if (result && result?.assets[0].uri) {
      const scanResult = await Camera.scanFromURLAsync(result?.assets[0].uri, ['qr']);

      if (scanResult[0]?.data) {
        handleBarCodeScanned({ data: scanResult[0]?.data || '' });
      }
    }
  };

  return (
    <View style={PageStyle.wrapper}>
      {!refresh && (
        <CameraView
          ratio={'16:9'}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
          style={[PageStyle.barCodeScanner, !isIOS && PageStyle.barCodeScannerAndroid]}
          onBarcodeScanned={handleBarCodeScanned}>
          <SafeAreaView style={PageStyle.innerView}>
            <View style={PageStyle.iconWrap}>
              <Touchable
                style={PageStyle.svgWrap}
                onPress={() => {
                  navigationService.goBack();
                }}>
                <Svg icon="left-arrow-v2" size={pTd(20)} />
              </Touchable>
              <Touchable style={PageStyle.svgWrap} onPress={selectImage}>
                <Svg icon="photo" size={pTd(24)} />
              </Touchable>
            </View>
            <Svg icon="scan-square" size={pTd(240)} iconStyle={PageStyle.scan} />
            <TextM style={PageStyle.tips}>{t('Send crypto and connect to dApps \n by scanning a QR code')}</TextM>
          </SafeAreaView>
        </CameraView>
      )}
    </View>
  );
};

export default QrScanner;

export const getStyles = makeStyles(theme => ({
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
    paddingTop: StatusBar.currentHeight,
    // backgroundColor: 'red',
  },
  iconWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: pTd(40),
  },
  svgWrap: {
    ...GStyles.paddingArg(16, 16, 16, 16),
  },
  scan: {
    marginTop: pTd(136),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tips: {
    color: theme.colors.textBase1,
    textAlign: 'center',
    width: screenWidth,
    lineHeight: pTd(20),
    marginTop: pTd(54),
    ...fonts.mediumFont,
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
}));
