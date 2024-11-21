import { useDiscoverGroupList, useGetS3ImageUrl } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { DiscoverItem } from '@portkey-wallet/store/store-ca/cms/types';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM } from 'components/CommonText';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import React, { useCallback, useMemo } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { pTd } from 'utils/unit';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import fonts from 'assets/theme/fonts';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import Touchable from 'components/Touchable';
import { useCmsBanner } from '@portkey-wallet/hooks/hooks-ca/cms/banner';
import { parseLink } from '@portkey-wallet/hooks/hooks-ca/cms/util';
import Banner, { BannerItemProps } from './components/Banner';
import { makeStyles } from '@rneui/themed';

export function DiscoverCmsListSection() {
  const styles = getStyles();
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

  const lists: BannerItemProps[] = useMemo(() => {
    return dappBannerList.map(it => {
      return {
        imgUrl: getS3ImgUrl(it.imgUrl.filename_disk),
        appLink: parseLink(it.appLink, it.url),
        title: it.title,
        description: it.description,
      };
    });
  }, [dappBannerList, getS3ImgUrl]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} style={styles.scroll} nestedScrollEnabled>
        <View style={styles.wrap}>
          {lists.length > 0 ? <Banner items={lists} /> : <View style={styles.init} />}
          {GroupList.map((group, index) => (
            <View key={index} style={styles.groupWrap}>
              <TextL style={styles.groupTitle}>{group.title}</TextL>
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
                      <TextWithProtocolIcon
                        textFontSize={pTd(16)}
                        wrapStyle={styles.itemTitleWrap}
                        title={item?.title}
                        url={item.url}
                        iconSize={12}
                        showProtocolIcon={false}
                      />
                      <TextM style={styles.itemDescription} numberOfLines={1} ellipsizeMode="tail">
                        {item?.description}
                      </TextM>
                    </View>
                  </Touchable>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
  },
  scroll: {
    backgroundColor: theme.colors.bgBase1,
  },
  init: {
    height: pTd(16),
  },
  wrap: {
    ...GStyles.paddingArg(0, 16),
    marginBottom: pTd(16),
    backgroundColor: theme.colors.bgBase1,
  },
  slide: {
    marginLeft: pTd(-16),
    marginTop: pTd(16),
    marginBottom: pTd(24),
  },
  groupWrap: {
    marginTop: pTd(16),
  },
  groupTitle: {
    color: theme.colors.textBase1,
    lineHeight: pTd(20),
    height: pTd(20),
    ...fonts.mediumFont,
  },
  itemsGroup: {
    overflow: 'hidden',
  },
  itemWrap: {
    backgroundColor: theme.colors.bgBase1,
    display: 'flex',
    flexDirection: 'row',
    ...GStyles.paddingArg(16, 0),
    width: '100%',
  },
  image: {
    width: pTd(42),
    height: pTd(42),
    marginRight: pTd(8),
    borderRadius: pTd(21),
  },
  right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  itemTitleWrap: {
    minHeight: pTd(22),
  },
  itemDescription: {
    color: theme.colors.textBase2,
  },
}));
