/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useState } from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle, TouchableOpacity, ScrollView } from 'react-native';
import { pTd } from 'utils/unit';
import PortkeySkeleton from 'components/PortkeySkeleton';
import { TAppLink } from '@portkey-wallet/types/types-ca/cms';
import useJump from 'hooks/useJump';
import { darkColors } from 'assets/theme';
import { TextXXL, TextXXXL } from 'components/CommonText';

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
            items.map((item, index) => (
              <View style={styles.carouselItemWrap} key={index}>
                <PortkeySkeleton
                  width={pTd(42)}
                  height={pTd(42)}
                  style={{ backgroundColor: darkColors.textBase2 }}
                  circle={true}
                />
                <PortkeySkeleton
                  width={pTd(120)}
                  height={pTd(20)}
                  style={{
                    marginVertical: pTd(8),
                    backgroundColor: darkColors.textBase2,
                    marginRight: index === items.length - 1 ? 0 : pTd(16),
                  }}
                />
                <PortkeySkeleton width={pTd(80)} height={pTd(18)} style={{ backgroundColor: darkColors.textBase2 }} />
              </View>
            ))}
          <View style={{ opacity: showSkeleton ? 0 : 1, flexDirection: 'row' }}>
            {items.map((item, index) => (
              <TouchableOpacity
                onPress={onPress({ index, item })}
                style={[styles.carouselItemWrap, { marginRight: index === items.length - 1 ? 0 : pTd(16) }]}
                key={index}>
                <Image
                  source={{ uri: item.imgUrl }}
                  style={[styles.avatar]}
                  resizeMode="cover"
                  onLoadEnd={onImageLoadEnd}
                />
                <TextXXXL>{item.title}</TextXXXL>
                <TextXXL style={styles.description}>{item.description}</TextXXL>
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
    paddingVertical: pTd(16),
    width: '100%',
    height: pTd(163),
  },
  carouselWrap: {
    flexDirection: 'row',
  },
  carouselItemWrap: {
    marginRight: pTd(16),
    padding: pTd(16),
    width: pTd(176),
    height: pTd(130),
    borderWidth: pTd(1),
    borderColor: darkColors.borderBase1,
    borderRadius: pTd(8),
  },
  avatar: {
    width: pTd(42),
    height: pTd(42),
    borderRadius: pTd(21),
  },
  description: {
    color: darkColors.textBase2,
  },
});

export default CarouselComponent;
