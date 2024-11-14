import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, TextBase } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import { TextS } from 'components/CommonText';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import NoData from 'components/NoData';
import { FontStyles } from 'assets/theme/styles';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { darkColors, defaultColors } from 'assets/theme';
import { DiscoverItem } from '@portkey-wallet/store/store-ca/cms/types';
import DiscoverWebsiteImage from '../DiscoverWebsiteImage';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import Touchable from 'components/Touchable';
import Svg, { IconName } from 'components/Svg';

interface ISearchDiscoverSectionProps {
  searchedDiscoverList: DiscoverItem[];
  inputValue?: string;
}

export default function SearchDiscoverSection(props: ISearchDiscoverSectionProps) {
  const { t } = useLanguage();
  const { searchedDiscoverList, inputValue } = props;
  console.log('inputValue:', inputValue);

  const { s3Url } = useCurrentNetworkInfo();
  const jumpToWebview = useDiscoverJumpWithNetWork();

  const onClickJump = useCallback(
    (i: DiscoverItem) => {
      jumpToWebview({
        item: {
          name: i.title,
          url: i?.url ?? i?.description,
        },
      });
    },
    [jumpToWebview],
  );

  // if (searchedDiscoverList.length === 0) return <NoData noPic message={t('There is no search result.')} />;

  // if (searchedDiscoverList.length === 0) {
  //   return (

  //   );
  // }

  // if (!inputValue) {

  // }

  return (
    <ScrollView style={styles.sectionWrap}>
      {searchedDiscoverList.length === 0 ? (
        <Touchable
          style={{
            flexDirection: 'row',
            marginTop: pTd(16),
          }}
          onPress={() => {
            jumpToWebview({
              item: {
                name: inputValue || '',
                url: `https://www.google.com/search?q=${inputValue}`,
              },
            });
          }}>
          <View
            style={{
              padding: pTd(10),
              borderRadius: pTd(20),
              borderWidth: 1,
              borderColor: darkColors.borderNeutral2,
              marginRight: pTd(8),
            }}>
            <Svg icon={'search'} size={pTd(20)} />
          </View>
          <View>
            <TextS
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={{
                color: defaultColors.textBase1,
                fontSize: 16,
              }}>
              {inputValue}
            </TextS>
            <TextS
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={[
                {
                  color: darkColors.textBase2,
                },
                itemStyle.gameInfo,
              ]}>
              Search with Google
            </TextS>
          </View>
        </Touchable>
      ) : (
        <>
          {searchedDiscoverList?.map((item, index) => (
            <Touchable key={index} style={itemStyle.wrap} onPress={() => onClickJump(item)}>
              <DiscoverWebsiteImage imageUrl={`${s3Url}/${item?.imgUrl?.filename_disk}`} size={pTd(32)} />
              <View style={itemStyle.right}>
                <View style={itemStyle.infoWrap}>
                  <TextWithProtocolIcon title={item?.title} url={item?.url} />
                  {item?.description && (
                    <TextS numberOfLines={1} ellipsizeMode={'tail'} style={[FontStyles.font3, itemStyle.gameInfo]}>
                      {item.description}
                    </TextS>
                  )}
                </View>
              </View>
            </Touchable>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionWrap: {
    ...GStyles.paddingArg(0, 20),
  },
  headerWrap: {
    height: pTd(22),
  },
  header: {
    ...fonts.mediumFont,
    lineHeight: pTd(24),
  },
  cancelButton: {
    paddingLeft: pTd(12),
    lineHeight: pTd(36),
  },
});

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(80),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  right: {
    height: pTd(80),
    marginLeft: pTd(16),
    paddingRight: pTd(16),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  image: {
    width: pTd(32),
    height: pTd(32),
    borderRadius: pTd(16),
  },
  infoWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  gameName: {
    lineHeight: pTd(22),
  },
  gameInfo: {
    lineHeight: pTd(16),
    marginTop: pTd(2),
  },
});
