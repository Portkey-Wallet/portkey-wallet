import React, { useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { DiscoverItem } from '@portkey-wallet/store/store-ca/cms/types';
import DiscoverWebsiteImage from '../DiscoverWebsiteImage';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { makeStyles } from '@rneui/themed';

interface ISearchDiscoverSectionProps {
  searchedDiscoverList: DiscoverItem[];
  inputValue?: string;
  onClick?: () => void;
}

export default function SearchDiscoverSection(props: ISearchDiscoverSectionProps) {
  const { searchedDiscoverList, inputValue, onClick } = props;
  const styles = getStyles();

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
    <ScrollView style={styles.sectionWrap} keyboardShouldPersistTaps="handled">
      {searchedDiscoverList.length === 0 ? (
        <Touchable
          style={styles.wrap}
          onPress={() => {
            jumpToWebview({
              item: {
                name: inputValue || '',
                url: `https://www.google.com/search?q=${inputValue}`,
              },
            });
          }}>
          <View style={styles.defaultIconWrap}>
            <Svg icon={'search'} size={pTd(20)} />
          </View>
          <View style={styles.right}>
            <View style={styles.gameNameWrap}>
              <TextL numberOfLines={1} ellipsizeMode={'tail'}>
                {inputValue}
              </TextL>
            </View>
            <View style={styles.gameInfoWrap}>
              <TextM numberOfLines={1} ellipsizeMode={'tail'} style={styles.gameInfo}>
                Search with Google
              </TextM>
            </View>
          </View>
        </Touchable>
      ) : (
        <>
          {searchedDiscoverList?.map((item, index) => (
            <Touchable key={index} style={styles.wrap} onPress={() => onClickJump(item)}>
              <DiscoverWebsiteImage imageUrl={`${s3Url}/${item?.imgUrl?.filename_disk}`} size={pTd(42)} />
              <View style={styles.right}>
                <View style={styles.gameNameWrap}>
                  <TextWithProtocolIcon title={item?.title} url={item?.url} textFontSize={pTd(16)} />
                </View>
                <View style={styles.gameInfoWrap}>
                  {item?.description && (
                    <TextM numberOfLines={1} ellipsizeMode={'tail'} style={styles.gameInfo}>
                      {item.description}
                    </TextM>
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

const getStyles = makeStyles(theme => ({
  sectionWrap: {
    ...GStyles.paddingArg(0, 16),
  },
  wrap: {
    height: pTd(74),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    height: pTd(74),
    marginLeft: pTd(8),
    paddingRight: pTd(16),
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  gameNameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: pTd(22),
  },
  gameInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: pTd(20),
  },
  gameInfo: {
    color: theme.colors.textBase2,
    marginTop: pTd(2),
    lineHeight: pTd(17.5),
  },
  defaultIconWrap: {
    width: pTd(42),
    height: pTd(42),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pTd(21),
    borderWidth: pTd(1),
    borderColor: theme.colors.borderNeutral2,
  },
}));
