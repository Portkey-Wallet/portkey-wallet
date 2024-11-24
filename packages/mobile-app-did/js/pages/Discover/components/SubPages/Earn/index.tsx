import { useGetS3ImageUrl } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useDiscoverData } from '@portkey-wallet/hooks/hooks-ca/cms/discover';
import { TBaseCardItemType } from '@portkey-wallet/types/types-ca/cms';
import { darkColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import CommonButton from 'components/CommonButton';
import { TextXL, TextL } from 'components/CommonText';
import NoData from 'components/NoData';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import React, { forwardRef, useCallback, useImperativeHandle } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { pTd } from 'utils/unit';
import { isUrl } from '@portkey-wallet/utils';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';

export default forwardRef(function EarnPage(_, _ref) {
  const { earnList = [], fetchDiscoverEarnAsync } = useDiscoverData();

  const onRefresh = useCallback(
    async (callback?: () => void) => {
      await fetchDiscoverEarnAsync();
      callback?.();
    },
    [fetchDiscoverEarnAsync],
  );

  useImperativeHandle(
    _ref,
    () => ({
      onRefresh,
    }),
    [onRefresh],
  );

  return (
    <View style={styles.container}>
      {earnList.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} nestedScrollEnabled>
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
});

const EarnItem = (item: TBaseCardItemType) => {
  const discoverJump = useDiscoverJumpWithNetWork();
  const getS3ImgUrl = useGetS3ImageUrl();
  const imageUrl = getS3ImgUrl(item.imgUrl.filename_disk);
  const { title = '', description, url, buttonTitle } = item;
  const onPress = useCallback(() => {
    if (!isUrl(url)) {
      return;
    }
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
        <View style={styles.infoCol}>
          <View style={styles.textLines}>
            <TextXL style={[styles.title, fonts.BGMediumFont]} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </TextXL>
            <TextL style={styles.description} numberOfLines={2} ellipsizeMode="tail">
              {description}
            </TextL>
          </View>
          <CommonButton
            type="outline"
            radius={pTd(24)}
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
    paddingBottom: pTd(24),
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: darkColors.bgBase1,
  },
  item: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: pTd(16),
    borderWidth: pTd(1),
    borderColor: darkColors.borderBase1,
    backgroundColor: darkColors.bgBase2,
    marginTop: pTd(16),
    overflow: 'hidden',
    width: screenWidth - pTd(32),
  },
  bigImage: {
    width: screenWidth - pTd(32),
    height: pTd(152),
  },
  infoWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: pTd(16),
    paddingVertical: pTd(16),
  },
  infoCol: {
    flexDirection: 'column',
    alignItems: 'flex-start',
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
    color: darkColors.textBase1,
    lineHeight: pTd(24),
    textAlign: 'left',
  },
  description: {
    marginTop: pTd(8),
    color: darkColors.textBase2,
    lineHeight: pTd(22),
    textAlign: 'left',
  },
  btn: {
    marginTop: pTd(16),
    paddingHorizontal: pTd(24),
    height: pTd(48),
  },
  btnTitle: {
    fontSize: pTd(14),
    lineHeight: pTd(16),
  },
  gap: {
    height: pTd(16),
  },
});
