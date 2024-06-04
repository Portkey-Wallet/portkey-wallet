import { useDiscoverGroupList, useGetS3ImageUrl } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { DiscoverItem } from '@portkey-wallet/store/store-ca/cms/types';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextM, TextS } from 'components/CommonText';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { pTd } from 'utils/unit';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import fonts from 'assets/theme/fonts';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import Touchable from 'components/Touchable';
import { useCmsBanner } from '@portkey-wallet/hooks/hooks-ca/cms/banner';
import CarouselComponent, { CarouselItemProps } from 'components/Carousel';

export function DiscoverCmsListSection() {
  const GroupList = useDiscoverGroupList();
  const { s3Url } = useCurrentNetworkInfo();
  const getS3ImgUrl = useGetS3ImageUrl();
  const { dappBannerList = [] } = useCmsBanner();
  const discoverJump = useDiscoverJumpWithNetWork();

  const onClickJump = useCallback(
    (i: DiscoverItem) => {
      discoverJump({
        item: {
          name: i.title,
          url: i?.url,
        },
      });
    },
    [discoverJump],
  );

  const lists: CarouselItemProps[] = useMemo(() => {
    return dappBannerList.map(it => {
      return {
        imgUrl: getS3ImgUrl(it.imgUrl.filename_disk),
        url: it.url,
      };
    });
  }, [dappBannerList, getS3ImgUrl]);

  return (
    <ScrollView contentContainerStyle={styles.scroll} style={styles.scroll}>
      <View style={styles.wrap}>
        {lists.length > 0 ? (
          <CarouselComponent
            containerStyle={styles.slide}
            items={lists}
            imageMarginHorizontal={16}
            showImageBorderRadius={true}
            imageRatio={343.0 / 128.0}
            dotStyle="Light"
          />
        ) : (
          <View style={styles.init} />
        )}
        {GroupList.map((group, index) => (
          <View key={index} style={styles.groupWrap}>
            <TextM style={[FontStyles.font5, fonts.mediumFont, styles.groupTitle]}>{group.title}</TextM>
            <View style={styles.itemsGroup}>
              {group.items.map((item, i) => (
                <Touchable key={i} style={styles.itemWrap} onPress={() => onClickJump(item)}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: item?.imgUrl?.filename_disk
                        ? `${s3Url}/${item?.imgUrl?.filename_disk}`
                        : getFaviconUrl(item.url),
                    }}
                  />
                  <View style={styles.right}>
                    <TextWithProtocolIcon textFontSize={pTd(16)} title={item?.title} url={item.url} iconSize={12} />
                    <TextS style={FontStyles.font7} numberOfLines={1} ellipsizeMode="tail">
                      {item?.description}
                    </TextS>
                  </View>
                </Touchable>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: defaultColors.white,
  },
  init: {
    height: pTd(16),
  },
  wrap: {
    ...GStyles.paddingArg(0, 16),
    marginBottom: pTd(16),
    backgroundColor: defaultColors.white,
  },
  slide: {
    marginLeft: pTd(-16),
    marginTop: pTd(16),
    marginBottom: pTd(24),
  },
  groupWrap: {
    marginBottom: pTd(16),
  },
  groupTitle: {
    marginBottom: pTd(8),
  },
  itemsGroup: {
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg1,
    overflow: 'hidden',
  },
  itemWrap: {
    backgroundColor: defaultColors.bg1,
    display: 'flex',
    flexDirection: 'row',
    ...GStyles.paddingArg(16, 0),
    width: '100%',
  },
  image: {
    width: pTd(36),
    height: pTd(36),
    marginRight: pTd(10),
    borderRadius: pTd(18),
  },
  right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});
