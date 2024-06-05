import { useGetS3ImageUrl } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCmsBanner } from '@portkey-wallet/hooks/hooks-ca/cms/banner';
import { useDiscoverData } from '@portkey-wallet/hooks/hooks-ca/cms/discover';
import { TBaseCardItemType } from '@portkey-wallet/types/types-ca/cms';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import CarouselComponent, { CarouselItemProps } from 'components/Carousel';
import { TextL, TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import { isUrl } from '@portkey-wallet/utils';
import { parseLink } from '@portkey-wallet/hooks/hooks-ca/cms/util';

export const LearnPage = () => {
  const { learnBannerList = [] } = useCmsBanner();
  const { learnShortGroupList } = useDiscoverData();
  const getS3ImgUrl = useGetS3ImageUrl();
  const discoverJump = useDiscoverJumpWithNetWork();
  const jumpToDiscover = useCallback(
    (url: string, title = '') => {
      if (!isUrl(url)) return;
      discoverJump({
        item: {
          name: title,
          url: url,
        },
      });
    },
    [discoverJump],
  );
  const lists: CarouselItemProps[] = useMemo(() => {
    return learnBannerList.map(it => {
      return {
        imgUrl: getS3ImgUrl(it.imgUrl.filename_disk),
        // url: it.url,
        appLink: parseLink(it.appLink),
      };
    });
  }, [getS3ImgUrl, learnBannerList]);

  return (
    <View style={styles.wrap}>
      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {lists.length > 0 && (
          <CarouselComponent
            items={lists}
            containerStyle={styles.scroll}
            imageMarginHorizontal={pTd(16)}
            showImageBorderRadius={true}
            imageRatio={343.0 / 128.0}
          />
        )}
        {learnShortGroupList.map((item, index) => {
          const { title, items = [] } = item;
          return (
            <View style={styles.block} key={index}>
              <View style={styles.blockTitle}>
                <TextM style={styles.blockTitleText}>{title}</TextM>
                <TouchableOpacity
                  style={styles.jumpIcon}
                  onPress={() => {
                    navigationService.navigate('SubLearnPage', { section: title, title });
                  }}>
                  <Svg icon="right-arrow" size={pTd(16)} color={defaultColors.font5} />
                </TouchableOpacity>
              </View>
              <ScrollView
                nestedScrollEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.blockScrollWrap}>
                <View style={styles.gap} />
                <View style={GStyles.flexRow}>
                  {items.map(it => {
                    return (
                      <ListItem key={it.title} item={it} getS3ImgUrl={getS3ImgUrl} jumpToDiscover={jumpToDiscover} />
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const ListItem = ({
  item,
  getS3ImgUrl,
  jumpToDiscover,
}: {
  item: TBaseCardItemType;
  jumpToDiscover: (url: string, title?: string) => void;
  getS3ImgUrl: (filename: string) => string;
}) => {
  const { title = '', url, imgUrl } = item;
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        jumpToDiscover(url, title);
      }}>
      <View style={itemStyles.item}>
        <Image style={itemStyles.img} source={{ uri: getS3ImgUrl(imgUrl.filename_disk) }} resizeMode="stretch" />
        <View style={itemStyles.textBlock}>
          <TextL style={itemStyles.describe} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </TextL>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: defaultColors.white,
  },
  scroll: {
    marginBottom: pTd(24),
  },
  container: {
    backgroundColor: defaultColors.white,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: pTd(16),
  },
  block: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  blockTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: pTd(16),
    width: '100%',
  },
  blockTitleText: {
    color: defaultColors.font5,
    lineHeight: pTd(22),
    ...fonts.mediumFont,
  },
  jumpIcon: {
    padding: pTd(6),
  },
  blockScrollWrap: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: pTd(24),
    minWidth: '100%',
  },
  gap: {
    width: pTd(16),
  },
});

const itemStyles = StyleSheet.create({
  item: {
    flexDirection: 'column',
    borderRadius: pTd(12),
    borderColor: defaultColors.bg32,
    borderWidth: pTd(1),
    overflow: 'hidden',
    marginRight: pTd(12),
  },
  img: {
    height: pTd(114),
    width: pTd(152),
  },
  textBlock: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: pTd(12),
    minHeight: pTd(68),
    width: '100%',
  },
  describe: {
    lineHeight: pTd(22),
    fontSize: pTd(14),
    color: defaultColors.font5,
    ...fonts.mediumFont,
    maxWidth: pTd(128),
    textAlign: 'left',
  },
});
