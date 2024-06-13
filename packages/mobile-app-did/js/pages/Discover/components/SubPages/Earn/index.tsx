import { useGetS3ImageUrl } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useDiscoverData } from '@portkey-wallet/hooks/hooks-ca/cms/discover';
import { TBaseCardItemType } from '@portkey-wallet/types/types-ca/cms';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import CommonButton from 'components/CommonButton';
import { TextL, TextS } from 'components/CommonText';
import NoData from 'components/NoData';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { pTd } from 'utils/unit';
import { isUrl } from '@portkey-wallet/utils';

export const EarnPage = () => {
  const { earnList = [] } = useDiscoverData();
  return (
    <View style={styles.container}>
      {earnList.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {earnList.map((item, index) => (
            <EarnItem key={index} {...item} />
          ))}
          <View style={styles.gap} />
        </ScrollView>
      ) : (
        <NoData message={'No Data'} />
      )}
    </View>
  );
};

const EarnItem = (item: TBaseCardItemType) => {
  const discoverJump = useDiscoverJumpWithNetWork();
  const getS3ImgUrl = useGetS3ImageUrl();
  const imageUrl = getS3ImgUrl(item.imgUrl.filename_disk);
  const { title = '', description, url, buttonTitle } = item;
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
    <View style={styles.item}>
      <TouchableOpacity onPress={onPress}>
        <Image style={styles.bigImage} source={{ uri: imageUrl }} />
      </TouchableOpacity>
      <View style={styles.infoWrap}>
        <View style={styles.infoLine}>
          <View style={styles.textLines}>
            <TextL style={[styles.title, fonts.mediumFont]} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </TextL>
            <TextS style={styles.description} numberOfLines={2} ellipsizeMode="tail">
              {description}
            </TextS>
          </View>
          <CommonButton
            type="primary"
            radius={pTd(4)}
            buttonStyle={styles.btn}
            titleStyle={[styles.btnTitle, fonts.mediumFont]}
            title={buttonTitle || 'Earn Now'}
            onPress={onPress}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: defaultColors.white,
  },
  item: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pTd(12),
    borderWidth: pTd(1),
    borderColor: defaultColors.bg32,
    marginTop: pTd(16),
    overflow: 'hidden',
  },
  bigImage: {
    width: pTd(343),
    height: pTd(128),
  },
  infoWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(16),
  },
  infoLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  textLines: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
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
  btn: {
    marginLeft: pTd(8),
    paddingHorizontal: pTd(16),
    height: pTd(34),
  },
  btnTitle: {
    fontSize: pTd(12),
    lineHeight: pTd(16),
  },
  gap: {
    height: pTd(16),
  },
});
