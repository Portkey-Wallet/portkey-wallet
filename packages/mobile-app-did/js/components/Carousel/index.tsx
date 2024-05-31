import React, { useMemo } from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import Carousel from 'rn-teaset/components/Carousel/Carousel';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';

const DEFAULT_CAROUSEL_IMAGE_RATIO = 375.0 / 125.0;

export interface CarouselItemProps {
  imgUrl: string;
  url: string;
}

export interface CarouselProps {
  containerStyle?: StyleProp<ViewStyle>;
  imageMarginHorizontal?: number;
  imageRatio?: number; // image 'width / height'
  showImageBorderRadius?: boolean;
  items: CarouselItemProps[];
  onClick?: ({ index, item }: { index: number; item: CarouselItemProps }) => void;
}

const CarouselComponent: React.FC<CarouselProps> = ({
  containerStyle,
  items,
  onClick,
  imageMarginHorizontal = 0,
  imageRatio = DEFAULT_CAROUSEL_IMAGE_RATIO,
  showImageBorderRadius = false,
}) => {
  const jumpToWebview = useDiscoverJumpWithNetWork();

  const onPress =
    ({ index, item }: { index: number; item: CarouselItemProps }) =>
    () => {
      if (onClick) {
        onClick({ index, item });
      } else {
        jumpToWebview({
          item: {
            name: item.url,
            url: item.url,
          },
        });
      }
    };

  const imageWidth = useMemo(() => {
    return screenWidth - imageMarginHorizontal * 2;
  }, [imageMarginHorizontal]);
  const imageHeight = useMemo(() => {
    return imageWidth / imageRatio;
  }, [imageRatio, imageWidth]);
  const containerHeight = useMemo(() => {
    return imageHeight;
  }, [imageHeight]);
  const imageBorderRadius = useMemo(() => {
    return showImageBorderRadius ? pTd(12) : 0;
  }, [showImageBorderRadius]);

  return (
    <Carousel
      style={[styles.container, { height: containerHeight }, containerStyle]}
      control={
        items.length > 1 && (
          <Carousel.Control
            style={styles.dotRow}
            dot={<View style={styles.dotStyle} />}
            activeDot={<View style={[styles.dotStyle, styles.activeDotStyle]} />}
          />
        )
      }
      carousel={items.length > 1}>
      {items.map((item, index) => {
        return (
          <TouchableOpacity
            style={{ marginHorizontal: imageMarginHorizontal }}
            key={index}
            onPress={onPress({ index, item })}
            activeOpacity={1}>
            <Image
              style={[styles.image, { height: imageHeight, borderRadius: imageBorderRadius }]}
              source={{ uri: item.imgUrl }}
              resizeMode="stretch"
            />
          </TouchableOpacity>
        );
      })}
    </Carousel>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
  },
  image: {
    width: '100%',
    overflow: 'hidden',
  },
  dotRow: {
    paddingBottom: 8,
  },
  activeDotStyle: {
    width: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: defaultColors.neutralSecondaryTextColor,
  },
  dotStyle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: defaultColors.neutralDisableText,
    marginHorizontal: 1,
  },
});

export default CarouselComponent;
