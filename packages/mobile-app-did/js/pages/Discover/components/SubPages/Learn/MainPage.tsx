import { useGetS3ImageUrl } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCmsBanner } from '@portkey-wallet/hooks/hooks-ca/cms/banner';
import { useDiscoverData } from '@portkey-wallet/hooks/hooks-ca/cms/discover';
import { TBaseCardItemType } from '@portkey-wallet/types/types-ca/cms';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import CarouselComponent, { CarouselItemProps } from 'components/Carousel';
import { TextL, TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { pTd } from 'utils/unit';
import { ScrollView } from 'react-native-gesture-handler';

export const LearnPage = () => {
  const { learnBannerList = [] } = useCmsBanner();
  const { learnGroupList = [] } = useDiscoverData();
  const getS3ImgUrl = useGetS3ImageUrl();
  const discoverJump = useDiscoverJumpWithNetWork();
  const jumpToDiscover = useCallback(
    (url: string, title = '') => {
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
        imgUrl: 'https://cdn.britannica.com/22/187222-050-07B17FB6/apples-on-a-tree-branch.jpg',
        url: it.url,
      };
    });
  }, [learnBannerList]);

  return (
    <View style={styles.wrap}>
      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <CarouselComponent items={lists} />
        {learnGroupList.map((item, index) => {
          const { title, items = [] } = item;
          return (
            <View style={styles.block} key={index}>
              <View style={styles.blockTitle}>
                <TextM style={styles.blockTitleText}>{title}</TextM>
                <TouchableOpacity
                  style={styles.jumpIcon}
                  onPress={() => {
                    console.log('jump to discover');
                  }}>
                  <Svg icon="right-arrow" size={pTd(16)} color={defaultColors.font5} />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal contentContainerStyle={styles.blockScrollWrap}>
                <View style={styles.gap} />
                {items.map(it => {
                  return (
                    <ListItem key={it.title} item={it} getS3ImgUrl={getS3ImgUrl} jumpToDiscover={jumpToDiscover} />
                  );
                })}
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
    <TouchableOpacity
      onPress={() => {
        jumpToDiscover(url, title);
      }}>
      <View style={itemStyles.item}>
        <Image
          style={itemStyles.img}
          source={{ uri: 'https://cdn.britannica.com/22/187222-050-07B17FB6/apples-on-a-tree-branch.jpg' }}
          resizeMode="stretch"
        />
        <View style={itemStyles.textBlock}>
          <TextL style={itemStyles.describe} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </TextL>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
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
    marginTop: pTd(12),
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: pTd(8),
    marginBottom: pTd(24),
    width: 375,
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
    borderTopWidth: StyleSheet.hairlineWidth,
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
    color: defaultColors.font5,
    ...fonts.mediumFont,
    maxWidth: pTd(128),
    textAlign: 'left',
  },
});
