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
import CommonButton from 'components/CommonButton';
import { BGStyles } from 'assets/theme/styles';
import SafeAreaBox from 'components/SafeAreaBox';

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
      cameraRef.current.pausePreview();
    } catch (error) {
      console.log('------', error);
    }
  }, []);

  const resetCamera = useCallback(() => {
    if (!cameraRef?.current) return;
    cameraRef.current.resumePreview();
    setImgUrl('');
  }, []);

  useEffectOnce(() => {
    (async () => {
      const result = await requestCameraPermission();
      console.log('=====requestCameraPermission====result', result);
    })();
  });

  return (
    <SafeAreaBox edges={['bottom', 'right', 'left']} style={PageStyle.safeAreaBox}>
      <View style={PageStyle.wrapper}>
        <Camera
          ratio={'16:9'}
          ref={cameraRef}
          style={[PageStyle.barCodeScanner, !isIOS && PageStyle.barCodeScannerAndroid]}>
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
        </Camera>
        <View
          style={[
            GStyles.flexRow,
            GStyles.center,
            !!imgUrl && GStyles.spaceBetween,
            BGStyles.bg19,
            PageStyle.buttonWrap,
          ]}>
          {imgUrl && (
            <Touchable style={PageStyle.reshutterWrap} onPress={resetCamera}>
              <Svg size={pTd(40)} icon="chat-reshutter" />
            </Touchable>
          )}
          {!imgUrl && (
            <Touchable onPress={takePicture} style={[GStyles.center, PageStyle.shutter]}>
              <Svg size={pTd(68)} icon="chat-shutter" />
            </Touchable>
          )}
          {imgUrl && <CommonButton title="Send" type="primary" buttonStyle={PageStyle.sendButton} />}
        </View>
        <Image style={PageStyle.previewImage} source={{ uri: imgUrl || '' }} />
      </View>
    </SafeAreaBox>
  );
};

export default QrScanner;

export const PageStyle = StyleSheet.create({
  safeAreaBox: {
    backgroundColor: defaultColors.bg19,
  },
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: defaultColors.bgColor1,
  },
  barCodeScanner: {
    width: '100%',
    flex: 1,
    zIndex: 100,
  },
  barCodeScannerAndroid: {
    width: screenWidth,
    height: screenHeight,
  },
  iconWrap: {
    marginTop: pTd(32),
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
    height: pTd(112),
    zIndex: 100,
    paddingHorizontal: pTd(20),
  },
  reshutterWrap: {
    borderRadius: pTd(20),
    overflow: 'hidden',
  },
  shutter: {
    flex: 1,
  },
  sendButton: {
    height: pTd(40),
    paddingHorizontal: pTd(16),
  },
  previewImage: {
    width: '100%',
  },
});
