import { useGetS3ImageUrl } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useDiscoverData } from '@portkey-wallet/hooks/hooks-ca/cms/discover';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TBaseCardItemType } from '@portkey-wallet/types/types-ca/cms';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { TextL, TextS } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { pTd } from 'utils/unit';
import { isUrl } from '@portkey-wallet/utils';

export interface SubLearnPageProps {
  section: string;
  title: string;
}

export const SubLearnPage = () => {
  const { section, title = 'Learn' } = useRouterParams<SubLearnPageProps>();
  const { learnGroupList = [] } = useDiscoverData();
  const getS3ImgUrl = useGetS3ImageUrl();
  const targetItemList = useMemo(() => {
    return learnGroupList.find(item => item.title === section)?.items || [];
  }, [learnGroupList, section]);
  return (
    <PageContainer titleDom={title}>
      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {targetItemList.map((item, index) => (
          <GuardItem key={index} {...item} getS3ImgUrl={getS3ImgUrl} />
        ))}
      </ScrollView>
    </PageContainer>
  );
};

const GuardItem = ({
  title = '',
  description,
  url,
  imgUrl,
  getS3ImgUrl,
}: TBaseCardItemType & {
  getS3ImgUrl: ReturnType<typeof useGetS3ImageUrl>;
}) => {
  const discoverJump = useDiscoverJumpWithNetWork();
  const imageUrl = getS3ImgUrl(imgUrl.filename_disk);
  const onPress = useCallback(() => {
    if (!isUrl(url)) return;
    discoverJump({
      item: {
        name: title,
        url: url,
      },
    });
  }, [discoverJump, title, url]);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <Image style={styles.image} source={{ uri: imageUrl }} resizeMode="stretch" />
        <View style={styles.textLine}>
          <TextL style={[styles.title, fonts.mediumFont]} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </TextL>
          <TextS style={styles.description} numberOfLines={1} ellipsizeMode="tail">
            {description}
          </TextS>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: pTd(8),
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  item: {
    padding: pTd(16),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    height: pTd(48),
    width: pTd(64),
    borderRadius: pTd(6),
  },
  textLine: {
    marginLeft: pTd(12),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    maxWidth: pTd(237),
  },
  title: {
    color: defaultColors.font5,
    lineHeight: pTd(24),
    textAlign: 'left',
  },
  description: {
    color: defaultColors.font11,
    lineHeight: pTd(16),
    textAlign: 'left',
  },
});
