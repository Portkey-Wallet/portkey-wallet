/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useState } from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle, TouchableOpacity, ScrollView } from 'react-native';
import { pTd } from 'utils/unit';
import PortkeySkeleton from 'components/PortkeySkeleton';
import { TAppLink } from '@portkey-wallet/types/types-ca/cms';
import useJump from 'hooks/useJump';
import { darkColors } from 'assets/theme';
import { TextM, TextXXL } from 'components/CommonText';
import fonts from 'assets/theme/fonts';

export interface BannerItemProps {
  imgUrl: string;
  appLink: TAppLink;
  title?: string;
  description?: string;
}

export interface BannerProps {
  containerStyle?: StyleProp<ViewStyle>;
  items: BannerItemProps[];
  onClick?: ({ index, item }: { index: number; item: BannerItemProps }) => void;
}

const CarouselComponent: React.FC<BannerProps> = ({ containerStyle, items, onClick }) => {
  const jump = useJump();
  const [showSkeleton, setShowSkeleton] = useState(true);

  const onPress =
    ({ index, item }: { index: number; item: BannerItemProps }) =>
    () => {
      if (onClick) {
        onClick({ index, item });
      } else {
        jump(item.appLink);
      }
    };

  const onImageLoadEnd = useCallback(() => {
    setShowSkeleton(false);
  }, []);

  return (
    <View style={[styles.container]}>
      <ScrollView
        contentContainerStyle={[styles.carouselWrap, containerStyle]}
        horizontal={true}
        showsHorizontalScrollIndicator={true}>
        <View style={styles.carouselWrap}>
          {showSkeleton &&
            items.map((_, index) => (
              <View style={styles.carouselItemWrap} key={index}>
                <PortkeySkeleton width={pTd(42)} height={pTd(42)} circle={true} />
                <PortkeySkeleton
                  width={pTd(120)}
                  height={pTd(20)}
                  style={{
                    marginVertical: pTd(8),
                    marginRight: index === items.length - 1 ? 0 : pTd(16),
                  }}
                />
                <PortkeySkeleton width={pTd(80)} height={pTd(18)} />
              </View>
            ))}
          <View style={{ opacity: showSkeleton ? 0 : 1, flexDirection: 'row' }}>
            {items.map((item, index) => (
              <TouchableOpacity
                onPress={onPress({ index, item })}
                style={[styles.carouselItemWrap, { marginRight: index === items.length - 1 ? 0 : pTd(8) }]}
                key={index}>
                <Image
                  source={{ uri: item.imgUrl }}
                  style={[styles.avatar]}
                  resizeMode="cover"
                  onLoadEnd={onImageLoadEnd}
                />
                <TextXXL numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
                  {item.title || ''}
                </TextXXL>
                <TextM style={styles.description}>{item.description || ''}</TextM>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: pTd(-16),
    height: pTd(162),
    alignItems: 'center',
    flexDirection: 'row',
  },
  carouselWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  carouselItemWrap: {
    marginRight: pTd(8),
    padding: pTd(11),
    width: pTd(176),
    height: pTd(130),
    borderWidth: pTd(1),
    borderColor: darkColors.borderBase1,
    borderRadius: pTd(16),
    backgroundColor: darkColors.bgBase2,
  },
  avatar: {
    width: pTd(42),
    height: pTd(42),
    borderRadius: pTd(21),
  },
  title: {
    marginTop: pTd(16),
    marginBottom: pTd(4),
    lineHeight: pTd(24),
    ...fonts.BGMediumFont,
  },
  description: {
    color: darkColors.textBase2,
    lineHeight: pTd(17.5),
  },
});

export default CarouselComponent;
