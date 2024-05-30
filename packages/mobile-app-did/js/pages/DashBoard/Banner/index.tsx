import React from 'react';
import { StyleSheet, View } from 'react-native';
import Carousel from 'components/Carousel';
import { useCmsBanner } from '@portkey-wallet/hooks/hooks-ca/cms/banner';
import { useGetS3ImageUrl } from '@portkey-wallet/hooks/hooks-ca/cms';
import { pTd } from 'utils/unit';

export const DashBoardBanner: React.FC = () => {
  const getS3ImageUrl = useGetS3ImageUrl();
  const { homeBannerList } = useCmsBanner();
  const list = homeBannerList.map(item => {
    return {
      url: item.url,
      imgUrl: getS3ImageUrl(item.imgUrl.filename_disk),
    };
  });
  if (list && list.length > 0) {
    return <Carousel items={list} containerStyle={styles.containerer} />;
  } else {
    return <View />;
  }
};

const styles = StyleSheet.create({
  containerer: {
    marginBottom: pTd(8),
  },
});
