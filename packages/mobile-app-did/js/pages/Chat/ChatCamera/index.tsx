import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { isIOS, screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import { Camera } from 'expo-camera';
import Touchable from 'components/Touchable';
import useEffectOnce from 'hooks/useEffectOnce';

const QrScanner: React.FC = () => {
  const cameraRef = useRef<any>();
  const [imgUrl, setImgUrl] = useState<string>('');
  const [status, requestCameraPermission] = Camera.useCameraPermissions();

  const takePicture = useCallback(async () => {
    if (!cameraRef?.current) return;
    try {
      const result = await cameraRef.current?.takePictureAsync();
      console.log('======result===', result, result.uri);
      setImgUrl(result.uri);
    } catch (error) {
      console.log('------', error);
    }
  }, []);

  useEffectOnce(() => {
    (async () => {
      const result = await requestCameraPermission();
      console.log('=====requestCameraPermission====result', result);
    })();
  });

  return (
    <View style={PageStyle.wrapper}>
      <Camera
        ratio={'16:9'}
        ref={cameraRef}
        style={[PageStyle.barCodeScanner, !isIOS && PageStyle.barCodeScannerAndroid]}>
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
        </SafeAreaView>
      </Camera>
      <View style={PageStyle.buttonWrap}>
        <Touchable onPress={takePicture} style={PageStyle.button} />
      </View>
      <Image style={PageStyle.img} source={{ uri: imgUrl || '' }} />
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
  leftBlock: {
    flex: 1,
  },
  buttonWrap: {
    width: screenWidth,
    position: 'absolute',
    zIndex: 100,
    bottom: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 'auto',
    borderRadius: 50,
    height: 100,
    width: 100,
    backgroundColor: defaultColors.bg1,
  },
  img: {
    position: 'absolute',
    zIndex: 100,
    top: 100,
    width: 100,
    height: 100,
  },
});
