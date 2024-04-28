import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { GetRedPackageDetailResult, GrabRedPackageResultEnum, RedPackageStatusEnum } from '@portkey-wallet/im';
import { useCurrentUserInfo, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useGetRedPackageDetail, useGrabRedPackage } from '@portkey-wallet/hooks/hooks-ca/im';
import { useCurrentChannelId } from 'pages/Chat/context/hooks';
import CommonToast from 'components/CommonToast';
import Lottie from 'lottie-react-native';

let timer: string | number | NodeJS.Timeout | undefined;

type ViewPacketOverlayPropsType = {
  redPacketData: GetRedPackageDetailResult;
  redPacketId: string;
};

const OVERLAY_MODAL_ANIMATED_TIME = 200;

export const ViewPacketOverlay = (props: ViewPacketOverlayPropsType) => {
  const { redPacketData, redPacketId } = props;
  const userInfo = useCurrentUserInfo();

  const currentChannelId = useCurrentChannelId();
  const grabPacket = useGrabRedPackage();
  const { init } = useGetRedPackageDetail();
  const wallet = useCurrentWalletInfo();

  const [isGrabNoneFail, setIsGrabNoneFail] = useState(false);
  const [isGrabExpiredFail, setIsGrabExpiredFail] = useState(false);

  const isMyRedPacket = useMemo(
    () => redPacketData?.senderId === userInfo?.userId,
    [redPacketData?.senderId, userInfo?.userId],
  );

  const isShowOpenButton = useMemo(() => {
    return !redPacketData?.isRedPackageFullyClaimed && !redPacketData?.isRedPackageExpired;
  }, [redPacketData?.isRedPackageFullyClaimed, redPacketData?.isRedPackageExpired]);

  const isShowViewDetailButton = useMemo<boolean>(() => {
    if (isGrabNoneFail) return true;

    if (isMyRedPacket) return true;
    if (redPacketData?.isRedPackageExpired) return false;
    if (!redPacketData?.isRedPackageFullyClaimed && !redPacketData?.isCurrentUserGrabbed) return false;

    return true;
  }, [
    isGrabNoneFail,
    isMyRedPacket,
    redPacketData?.isCurrentUserGrabbed,
    redPacketData?.isRedPackageExpired,
    redPacketData?.isRedPackageFullyClaimed,
  ]);

  const animateRef = useRef<any>();
  const openBtnRef = useRef<OpenPacketButtonInstance>(null);
  const imgUpPosition = useRef(new Animated.Value(0)).current;
  const imgUpScale = useRef(new Animated.Value(1)).current;
  const imgDownPosition = useRef(new Animated.Value(0)).current;
  const imgDownScale = useRef(new Animated.Value(1)).current;
  const maskOpacity = useRef(new Animated.Value(0.3)).current;

  const [showCloseButton, setShowDialogCloseButton] = useState(true);
  const isFetchingRef = useRef(false);

  const startAnimation = useCallback(() => {
    // navigationService.navigate('RedPacketDetails');
    animateRef.current = Animated.parallel([
      Animated.timing(imgUpPosition, {
        toValue: -pTd(ScreenHeight / 2),
        duration: OVERLAY_MODAL_ANIMATED_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(imgUpScale, {
        toValue: screenWidth / pTd(300),
        duration: OVERLAY_MODAL_ANIMATED_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(imgDownPosition, {
        toValue: pTd(400),
        duration: OVERLAY_MODAL_ANIMATED_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(imgDownScale, {
        toValue: screenWidth / pTd(300),
        duration: OVERLAY_MODAL_ANIMATED_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(maskOpacity, {
        toValue: 0,
        duration: OVERLAY_MODAL_ANIMATED_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]);

    animateRef.current.start();

    timer = setTimeout(() => {
      OverlayModal.hide();
    }, OVERLAY_MODAL_ANIMATED_TIME);
  }, [imgDownPosition, imgDownScale, maskOpacity, imgUpPosition, imgUpScale]);

  const onOpen = useCallback(async () => {
    if (!wallet[redPacketData.chainId]?.caAddress) {
      CommonToast.warn(
        'Newly created accounts need a second for info update. Please come back to claim the crypto box later.',
      );
      return;
    }

    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    openBtnRef.current?.startRotate();
    await sleep(500);

    try {
      const { result, viewStatus } = await grabPacket(currentChannelId || '', redPacketId);
      if (result === GrabRedPackageResultEnum.SUCCESS) {
        const data = await init({ id: redPacketId });
        navigationService.navigate('RedPacketDetails', { redPacketId, data });
        setShowDialogCloseButton(false);
        openBtnRef.current?.destroyDom();
        startAnimation();
      } else {
        openBtnRef.current?.destroyDom();
        if (viewStatus === RedPackageStatusEnum.NONE_LEFT) setIsGrabNoneFail(true);
        else setIsGrabExpiredFail(true);
      }
    } catch (error) {
      openBtnRef.current?.stopRotate();
      CommonToast.failError(error);
    }
    isFetchingRef.current = false;
  }, [currentChannelId, grabPacket, init, redPacketData.chainId, redPacketId, startAnimation, wallet]);

  useEffect(
    () => () => {
      animateRef?.current?.stop();
      if (timer) clearTimeout(timer);
    },
    [imgDownPosition, imgDownScale, imgUpPosition, imgUpScale],
  );

  const [isGoDetailLoading, setIsGoDetailLoading] = useState(false);
  const onGoDetail = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setIsGoDetailLoading(true);
    try {
      const data = await init({ id: redPacketId });

      OverlayModal.hide();
      navigationService.navigate('RedPacketDetails', { redPacketId, data });
    } catch (error) {
      CommonToast.failError(error);
    }

    setIsGoDetailLoading(false);
    isFetchingRef.current = false;
  }, [init, redPacketId]);

  const onClose = useCallback(() => {
    if (isFetchingRef.current) return;
    OverlayModal.hide();
  }, []);

  const memoStr = useMemo(() => {
    if (isGrabNoneFail) return 'Better luck next time!';
    if (isGrabExpiredFail) return 'This crypto box has expired.';
    if (redPacketData.isRedPackageExpired) return 'This crypto box has expired.';
    if (redPacketData.isRedPackageFullyClaimed) return 'Better luck next time!';
    return redPacketData.memo;
  }, [
    isGrabExpiredFail,
    isGrabNoneFail,
    redPacketData.isRedPackageExpired,
    redPacketData.isRedPackageFullyClaimed,
    redPacketData.memo,
  ]);

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
            <CommonAvatar
              resizeMode="cover"
              avatarSize={pTd(40)}
              title={redPacketData?.senderName}
              imageUrl={redPacketData?.senderAvatar}
            />
            <TextL style={styles.sentBy}>{`Crypto Box from ${redPacketData?.senderName}`}</TextL>
            <TextXXXL numberOfLines={2} style={styles.memo}>
              {memoStr}
            </TextXXXL>
          </ImageBackground>
        </Animated.View>

        {isShowOpenButton && <OpenPacketButton wrapStyle={styles.openButtonWrap} ref={openBtnRef} onPress={onOpen} />}
        <Animated.View
          style={[
            {
              transform: [{ translateY: imgDownPosition }, { scaleX: imgDownScale }, { scaleY: imgDownScale }],
            },
          ]}>
          <ImageBackground source={Red_Packet_02} style={[styles.img, styles.imgDown]}>
            {isShowViewDetailButton && (
              <Touchable style={styles.viewDetailWrap} onPress={onGoDetail}>
                <TextM style={styles.detailText}>View Details</TextM>
                {isGoDetailLoading ? (
                  <Lottie
                    style={styles.loadingStyle}
                    source={require('assets/lottieFiles/loading_white.json')}
                    autoPlay
                    loop
                  />
                ) : (
                  <Svg icon="right-arrow" size={pTd(16)} color={defaultColors.font14} />
                )}
              </Touchable>
            )}
          </ImageBackground>
        </Animated.View>
        {showCloseButton && (
          <Touchable style={styles.closeWrap} onPress={onClose}>
            <Svg icon="close-red-packet" size={pTd(40)} />
          </Touchable>
        )}
      </View>
    </View>
  );
};

const showViewPacketOverlay = (props: ViewPacketOverlayPropsType) => {
  Keyboard.dismiss();
  OverlayModal.show(<ViewPacketOverlay {...props} />, {
    position: 'center',
    type: 'zoomOut',
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
    marginTop: -pTd(42),
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
    marginBottom: pTd(18),
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
  loadingStyle: {
    width: pTd(16),
  },
});
