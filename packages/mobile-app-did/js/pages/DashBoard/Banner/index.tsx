import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Carousel from 'components/Carousel';
import { useCmsBanner } from '@portkey-wallet/hooks/hooks-ca/cms/banner';
import { useGetS3ImageUrl } from '@portkey-wallet/hooks/hooks-ca/cms';
import { pTd } from 'utils/unit';
import { parseLink } from '@portkey-wallet/hooks/hooks-ca/cms/util';

export const DashBoardBanner: React.FC = () => {
  const getS3ImageUrl = useGetS3ImageUrl();
  const { homeBannerList } = useCmsBanner();
  const list = useMemo(() => {
    return homeBannerList.map(item => {
      return {
        appLink: parseLink(item.appLink, item.url),
        imgUrl: getS3ImageUrl(item.imgUrl.filename_disk),
      };
    });
  }, [getS3ImageUrl, homeBannerList]);

  if (!list?.length) return null;
  return <Carousel items={list} containerStyle={styles.container} showDivider={true} />;
};

const styles = StyleSheet.create({
  container: {
    marginBottom: pTd(8),
  },
});
