import React, { useCallback, useEffect, useRef, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { ImageBackground, Keyboard, StyleSheet, View, Animated, Easing } from 'react-native';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import Red_Packet_01 from '../../img/Red_Packet_01.png';
import Red_Packet_02 from '../../img/Red_Packet_02.png';
import Touchable from 'components/Touchable';
import OpenPacketButton, { OpenPacketButtonInstance } from '../OpenPacketButton';
import { TextL, TextM, TextXXXL } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import CommonAvatar from 'components/CommonAvatar';
import GStyles from 'assets/theme/GStyles';
import { screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import navigationService from 'utils/navigationService';
import { ScreenHeight } from '@rneui/base';
import { sleep } from '@portkey-wallet/utils';

let timer: string | number | NodeJS.Timeout | undefined;

export const ViewPacketOverlay = () => {
  const animateRef = useRef<any>();
  const openBtnRef = useRef<OpenPacketButtonInstance>(null);
  const imgUpPosition = useRef(new Animated.Value(0)).current;
  const imgUpScale = useRef(new Animated.Value(1)).current;
  const imgDownPosition = useRef(new Animated.Value(0)).current;
  const imgDownScale = useRef(new Animated.Value(1)).current;
  const maskOpacity = useRef(new Animated.Value(0.3)).current;

  const [showCloseButton, setShowDialogCloseButton] = useState(true);

  const startAnimation = useCallback(() => {
    // navigationService.navigate('RedPacketDetails');
    animateRef.current = Animated.parallel([
      Animated.timing(imgUpPosition, {
        toValue: -pTd(ScreenHeight / 2),
        duration: 600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(imgUpScale, {
        toValue: screenWidth / pTd(300),
        duration: 600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(imgDownPosition, {
        toValue: pTd(400),
        duration: 600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(imgDownScale, {
        toValue: screenWidth / pTd(300),
        duration: 600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(maskOpacity, {
        toValue: 0,
        duration: 600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]);

    animateRef.current.start();

    timer = setTimeout(() => {
      OverlayModal.hide();
    }, 600);
  }, [imgDownPosition, imgDownScale, maskOpacity, imgUpPosition, imgUpScale]);

  const onOpen = useCallback(async () => {
    openBtnRef.current?.startRotate();
    await sleep(2000);
    navigationService.navigate('RedPacketDetails');
    openBtnRef.current?.destroyDom();
    setShowDialogCloseButton(false);

    startAnimation();
  }, [startAnimation]);

  useEffect(
    () => () => {
      animateRef?.current?.stop();
      if (timer) clearTimeout(timer);
    },
    [imgDownPosition, imgDownScale, imgUpPosition, imgUpScale],
  );

  return (
    <View style={[GStyles.center, styles.page]}>
      <Animated.View style={[styles.mask, { opacity: maskOpacity }]} />
      <View>
        <Animated.View
          style={[
            GStyles.itemCenter,
            {
              transform: [{ translateY: imgUpPosition }, { scaleX: imgUpScale }, { scaleY: imgUpScale }],
            },
          ]}>
          <ImageBackground source={Red_Packet_01} style={[styles.img, styles.imgUp, GStyles.itemCenter]}>
            <CommonAvatar avatarSize={pTd(40)} title="red" />
            {/* TODO: */}
            <TextL style={styles.sentBy}>{`Sent by xxxxxxxxxxxxxx`}</TextL>
            <TextM numberOfLines={2} style={styles.memo}>
              This red packet has been received for more than 24 hours. If you have received it, you can view it in the
              details.
            </TextM>
            <TextXXXL numberOfLines={2} style={styles.memo}>
              Best Wishes! Best wishes best wishes best Best Wishes! Best wishes best wishes best
            </TextXXXL>
          </ImageBackground>
        </Animated.View>

        <OpenPacketButton wrapStyle={styles.openButtonWrap} ref={openBtnRef} onPress={onOpen} />
        <Animated.View
          style={[
            {
              transform: [{ translateY: imgDownPosition }, { scaleX: imgDownScale }, { scaleY: imgDownScale }],
            },
          ]}>
          <ImageBackground source={Red_Packet_02} style={[styles.img, styles.imgDown]}>
            <Touchable style={styles.viewDetailWrap}>
              <TextM style={styles.detailText}>View Detail</TextM>
              <Svg icon="right-arrow" size={pTd(16)} color={defaultColors.font14} />
            </Touchable>
          </ImageBackground>
        </Animated.View>
        {showCloseButton && (
          <Touchable
            style={styles.closeWrap}
            onPress={() => {
              OverlayModal.hide();
            }}>
            <Svg icon="close-red-packet" size={pTd(40)} />
          </Touchable>
        )}
      </View>
    </View>
  );
};

const showViewPacketOverlay = () => {
  Keyboard.dismiss();
  OverlayModal.show(<ViewPacketOverlay />, {
    position: 'center',
    animated: false,
    overlayOpacity: 0,
    containerStyle: {
      marginBottom: 0,
    },
  });
};

export default {
  showViewPacketOverlay,
};

const styles = StyleSheet.create({
  page: {
    width: screenWidth,
    height: screenHeight,
    position: 'relative',
  },
  mask: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: defaultColors.bg19,
    opacity: 0.3,
  },
  wrap: {
    zIndex: 1000,
    position: 'relative',
  },
  openButtonWrap: {
    position: 'absolute',
    bottom: pTd(60),
    left: pTd(106),
    zIndex: 100,
  },
  img: {
    width: pTd(300),
  },
  imgUp: {
    zIndex: 10,
    height: pTd(328),
    paddingTop: pTd(60),
  },
  imgDown: {
    height: pTd(140),
    marginTop: -pTd(40),
    zIndex: 10,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  sentBy: {
    color: defaultColors.font14,
    paddingHorizontal: pTd(16),
    marginTop: pTd(8),
    marginBottom: pTd(12),
  },
  memo: {
    textAlign: 'center',
    paddingHorizontal: pTd(16),
    color: defaultColors.font14,
  },
  detailText: {
    color: defaultColors.font14,
    marginRight: pTd(4),
  },
  viewDetailWrap: {
    marginBottom: pTd(26),
    zIndex: 1000,
    width: pTd(300),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeWrap: {
    width: pTd(300),
    position: 'absolute',
    bottom: -pTd(64),
    display: 'flex',
    alignItems: 'center',
  },
});
