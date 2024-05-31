import React from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import Carousel from 'rn-teaset/components/Carousel/Carousel';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';

export interface CarouselItemProps {
  imgUrl: string;
  url: string;
}

export interface CarouselProps {
  containerStyle?: StyleProp<ViewStyle>;
  items: CarouselItemProps[];
  onClick?: ({ index, item }: { index: number; item: CarouselItemProps }) => void;
}

const CarouselComponent: React.FC<CarouselProps> = ({ containerStyle, items, onClick }) => {
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

  return (
    <Carousel
      style={[styles.container, containerStyle]}
      control={
        <Carousel.Control
          style={styles.dotRow}
          dot={<View style={styles.dotStyle} />}
          activeDot={<View style={[styles.dotStyle, styles.activeDotStyle]} />}
        />
      }
      carousel={true}>
      {items.map((item, index) => {
        return (
          <TouchableOpacity style={styles.imageWrap} key={index} onPress={onPress({ index, item })} activeOpacity={1}>
            <Image style={styles.image} source={{ uri: item.imgUrl }} resizeMode="stretch" />
          </TouchableOpacity>
        );
      })}
    </Carousel>
  );
};

// horizontal padding is 16
const imageWidth = screenWidth - pTd(16) * 2;
// image w/h ratio is 343 : 128
const imageHeight = (128.0 / 343.0) * imageWidth;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: imageHeight,
  },
  imageWrap: {
    paddingHorizontal: pTd(16),
  },
  image: {
    width: '100%',
    height: imageHeight,
    borderRadius: pTd(12),
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
