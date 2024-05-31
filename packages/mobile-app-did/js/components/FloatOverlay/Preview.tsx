import React, { useRef } from 'react';
import { screenHeight, screenWidth, windowHeight } from '@portkey-wallet/utils/mobile/device';
import OverlayModal, { CustomBounds } from 'components/OverlayModal';
import { ImageProps, Keyboard, StyleSheet } from 'react-native';
import CacheImage from 'components/CacheImage';
import GStyles from 'assets/theme/GStyles';
import TransformView from 'rn-teaset/components/TransformView/TransformView';
import { formatImageSize } from '@portkey-wallet/utils/img';
type PreviewImageProps = {
  source: ImageProps['source'];
  thumb?: ImageProps['source'];
  width?: number | string;
  height?: number | string;
};

const maxWidth = screenWidth;
const maxHeight = windowHeight;

function PreviewImage({ source, thumb, width, height }: PreviewImageProps) {
  const scaleRef = useRef<number>(1);

  const imageSize = formatImageSize({ width, height, maxWidth, maxHeight });

  // const [init, setInit] = useState(true);
  // useEffectOnce(() => {
  //   const timer = setTimeout(() => {
  //     setInit(false);
  //   }, 200);
  //   return () => {
  //     timer && clearTimeout(timer);
  //   };
  // });
  // if (init) return null;

  return (
    <TransformView
      onPress={OverlayModal.hide}
      onDidTransform={(_: number, translateY: number) => {
        if (scaleRef.current !== 1) return;
        if (Math.abs(translateY) > 50) OverlayModal.hide();
      }}
      onTransforming={(translateX: number, translateY: number, scale: number) => {
        scaleRef.current = scale;
      }}
      style={GStyles.flex1}
      containerStyle={styles.containerStyle}>
      <CacheImage thumb={thumb} resizeMode="contain" style={imageSize} source={source} />
    </TransformView>
  );
}

export function showPreviewImage({
  customBounds,
  source,
  thumb,
  width,
  height,
}: {
  customBounds: CustomBounds;
} & PreviewImageProps) {
  Keyboard.dismiss();
  OverlayModal.show(<PreviewImage width={width} height={height} thumb={thumb} source={source} />, {
    customBounds: customBounds,
    position: 'center',
    style: styles.overlayStyle,
    containerStyle: styles.overlayStyle,
    overlayOpacity: 0.8,
  });
}

const styles = StyleSheet.create({
  overlayStyle: { width: screenWidth, height: screenHeight },
  containerStyle: { height: screenHeight, width: screenWidth, ...GStyles.center },
});
