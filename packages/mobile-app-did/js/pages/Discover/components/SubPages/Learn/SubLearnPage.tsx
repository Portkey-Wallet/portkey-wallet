import { useGetS3ImageUrl } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCmsBanner } from '@portkey-wallet/hooks/hooks-ca/cms/banner';
import { defaultColors } from 'assets/theme';
import CarouselComponent, { CarouselItemProps } from 'components/Carousel';
import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export const LearnPage = () => {
  const { learnBannerList = [] } = useCmsBanner();
  const getS3ImgUrl = useGetS3ImageUrl();
  const lists: CarouselItemProps[] = useMemo(() => {
    return learnBannerList.map(it => {
      return {
        imgUrl: getS3ImgUrl(it.imgUrl.filename_disk),
        url: it.url,
      };
    });
  }, [getS3ImgUrl, learnBannerList]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CarouselComponent items={lists} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultColors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
