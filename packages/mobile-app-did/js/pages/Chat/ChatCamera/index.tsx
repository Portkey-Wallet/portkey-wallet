import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { isIOS, screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import { Camera, CameraCapturedPicture } from 'expo-camera';
import Touchable from 'components/Touchable';
import useEffectOnce from 'hooks/useEffectOnce';
import CommonButton from 'components/CommonButton';
import { BGStyles } from 'assets/theme/styles';
import SafeAreaBox from 'components/SafeAreaBox';
import { useSendCurrentChannelMessage } from '../components/hooks';
import CommonToast from 'components/CommonToast';

const ChatCamera: React.FC = () => {
  const cameraRef = useRef<Camera>(null);
  const [sending, setSending] = useState(false);
  const [img, setImgUrl] = useState<CameraCapturedPicture>();
  const [, requestCameraPermission] = Camera.useCameraPermissions();
  const { sendChannelImage } = useSendCurrentChannelMessage();
  const takePicture = useCallback(async () => {
    if (!cameraRef?.current) return;
    try {
      const result = await cameraRef.current?.takePictureAsync();
      setImgUrl(result);
      cameraRef.current.pausePreview();
    } catch (error) {
      console.log('------', error);
      CommonToast.fail('Failed to send message');
    }
  }, []);

  const resetCamera = useCallback(() => {
    if (!cameraRef?.current) return;
    cameraRef.current.resumePreview();
    setImgUrl(undefined);
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
          {!sending && (
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
          )}
        </Camera>
        <View
          style={[
            GStyles.flexRow,
            GStyles.center,
            !!img?.uri && GStyles.spaceBetween,
            BGStyles.bg19,
            PageStyle.buttonWrap,
          ]}>
          {img?.uri &&
            (sending ? (
              <View />
            ) : (
              <Touchable style={PageStyle.reshutterWrap} onPress={resetCamera}>
                <Svg size={pTd(40)} icon="chat-reshutter" />
              </Touchable>
            ))}
          {!img?.uri && (
            <Touchable onPress={takePicture} style={[GStyles.center, PageStyle.shutter]}>
              <Svg size={pTd(68)} icon="chat-shutter" />
            </Touchable>
          )}
          {img?.uri && (
            <CommonButton
              title="Send"
              type="primary"
              loading={sending}
              buttonStyle={PageStyle.sendButton}
              onPress={async () => {
                try {
                  setSending(true);
                  await sendChannelImage(img);
                  navigationService.goBack();
                } catch (error) {
                  CommonToast.failError(error);
                } finally {
                  setSending(false);
                }
              }}
            />
          )}
        </View>
        <Image style={PageStyle.previewImage} source={{ uri: img?.uri || '' }} />
      </View>
    </SafeAreaBox>
  );
};

export default ChatCamera;

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
    minWidth: pTd(64),
    paddingHorizontal: pTd(16),
  },
  previewImage: {
    width: '100%',
  },
});
