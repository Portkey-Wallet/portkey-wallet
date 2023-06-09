import React, { useCallback, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';

import { useLanguage } from 'i18n/hooks';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleQRCodeData, invalidQRCode, RouteInfoType } from 'utils/qrcode';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { TextM } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { isIos, screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';

import { Camera } from 'expo-camera';
import { expandQrData } from '@portkey-wallet/utils/qrCode';

interface QrScannerProps {
  route?: any;
  type?: 'login' | 'send';
}

const QrScanner: React.FC<QrScannerProps> = () => {
  const { t } = useLanguage();
  const { currentNetwork } = useWallet();
  const navigation = useNavigation();
  const routesArr: RouteInfoType[] = navigation.getState().routes;
  const previousRouteInfo = routesArr[routesArr.length - 2];
  console.log(previousRouteInfo, '=====previousRouteInfo');

  const [refresh, setRefresh] = useState<boolean>();
  useFocusEffect(
    useCallback(() => {
      setRefresh(false);
    }, []),
  );

  const handleBarCodeScanned = useCallback(
    ({ data = '' }) => {
      try {
        if (typeof data === 'string') {
          const qrCodeData = expandQrData(JSON.parse(data));

          // if not currentNetwork
          if (currentNetwork !== qrCodeData.netWorkType) return invalidQRCode();
          handleQRCodeData(qrCodeData, previousRouteInfo, setRefresh);
        }
      } catch (error) {
        console.log(error);
        return invalidQRCode();
      }
    },
    [currentNetwork, previousRouteInfo],
  );

  const selectImage = async () => {
    const result = (await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
    })) as unknown as { uri: string };

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
          style={[PageStyle.barCodeScanner, !isIos && PageStyle.barCodeScannerAndroid]}
          onBarCodeScanned={handleBarCodeScanned}>
          <SafeAreaView style={PageStyle.innerView}>
            <View style={PageStyle.iconWrap}>
              <Text style={PageStyle.leftBlock} />
              <TouchableOpacity
                style={PageStyle.svgWrap}
                onPress={() => {
                  navigationService.goBack();
                }}>
                <Svg icon="close1" size={pTd(14)} iconStyle={PageStyle.icon} />
              </TouchableOpacity>
            </View>
            <Svg icon="scan-square" size={pTd(240)} iconStyle={PageStyle.scan} />
            <TextM style={PageStyle.tips}>{t('Receive code / Login code')}</TextM>

            <TouchableOpacity style={[PageStyle.albumWrap, GStyles.alignCenter]} onPress={selectImage}>
              <Svg icon="album" size={pTd(48)} />
              <TextM style={[FontStyles.font2, PageStyle.albumText]}>{t('Album')}</TextM>
            </TouchableOpacity>
          </SafeAreaView>
        </Camera>
      )}
    </View>
  );
};

export default QrScanner;

defaultColors;

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
