import React, { useRef } from 'react';
import { screenWidth, windowHeight, windowWidth } from '@portkey-wallet/utils/mobile/device';
import OverlayModal, { CustomBounds } from 'components/OverlayModal';
import { ImageProps, StyleSheet } from 'react-native';
import CacheImage from 'components/CacheImage';
import GStyles from 'assets/theme/GStyles';
import TransformView from 'rn-teaset/components/TransformView/TransformView';
type PreviewImageProps = { source: ImageProps['source']; thumb?: ImageProps['source'] };

function PreviewImage({ source, thumb }: PreviewImageProps) {
  const scaleRef = useRef<number>(1);
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
      <CacheImage thumb={thumb} resizeMode="contain" style={GStyles.flex1} source={source} />
    </TransformView>
  );
}

export function showPreviewImage({
  customBounds,
  source,
  thumb,
}: {
  customBounds: CustomBounds;
} & PreviewImageProps) {
  OverlayModal.show(<PreviewImage thumb={thumb} source={source} />, {
    customBounds: customBounds,
    position: 'center',
    containerStyle: { ...GStyles.flex1, width: screenWidth },
  });
}

const styles = StyleSheet.create({
  containerStyle: { height: windowHeight * 0.8, width: windowWidth },
});
