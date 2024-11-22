import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { TextS } from 'components/CommonText';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import { FontStyles } from 'assets/theme/styles';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { darkColors, defaultColors } from 'assets/theme';
import { DiscoverItem } from '@portkey-wallet/store/store-ca/cms/types';
import DiscoverWebsiteImage from '../DiscoverWebsiteImage';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';

interface ISearchDiscoverSectionProps {
  searchedDiscoverList: DiscoverItem[];
  inputValue?: string;
  onClick?: () => void;
}

export default function SearchDiscoverSection(props: ISearchDiscoverSectionProps) {
  const { searchedDiscoverList, inputValue, onClick } = props;
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
      onClick?.();
    },
    [jumpToWebview, onClick],
  );

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
              <DiscoverWebsiteImage imageUrl={`${s3Url}/${item?.imgUrl?.filename_disk}`} size={pTd(42)} />
              <View style={itemStyle.right}>
                <View style={itemStyle.infoWrap}>
                  <TextWithProtocolIcon title={item?.title} url={item?.url} textFontSize={pTd(14)} />
                  {item?.description && (
                    <TextS numberOfLines={1} ellipsizeMode={'tail'} style={[FontStyles.font1, itemStyle.gameInfo]}>
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
    height: pTd(78),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  right: {
    height: pTd(80),
    marginLeft: pTd(8),
    paddingRight: pTd(16),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
