import { useDiscoverGroupList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { DiscoverItem } from '@portkey-wallet/store/store-ca/cms/types';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextL, TextM, TextS } from 'components/CommonText';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { pTd } from 'utils/unit';

export function DiscoverCmsListSection() {
  const GroupList = useDiscoverGroupList();
  const { s3Url } = useCurrentNetworkInfo();
  const discoverJump = useDiscoverJumpWithNetWork();

  const onJump = useCallback(
    (i: DiscoverItem) => {
      discoverJump({
        item: {
          id: Date.now(),
          name: i.title,
          url: i?.url ?? i?.description,
        },
      });
    },
    [discoverJump],
  );

  return (
    <ScrollView style={styles.wrap}>
      {GroupList.map((group, index) => (
        <View key={index}>
          <TextM style={[FontStyles.font3, styles.groupTitle]}>{group.title}</TextM>
          <View style={styles.itemsGroup}>
            {group.items.map((item, i) => (
              <TouchableOpacity key={i} style={styles.itemWrap} onPress={() => onJump(item)}>
                <Image style={styles.image} source={{ uri: `${s3Url}/${item?.imgUrl?.filename_disk}` }} />
                <View style={styles.right}>
                  <TextL style={FontStyles.font5} numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                  </TextL>
                  <TextS style={FontStyles.font7} numberOfLines={1} ellipsizeMode="tail">
                    {item.description}
                  </TextS>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...GStyles.paddingArg(8, 20),
    flex: 1,
  },
  groupTitle: {
    marginBottom: pTd(8),
    marginTop: pTd(16),
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
    ...GStyles.paddingArg(16, 12),
    width: '100%',
  },
  image: {
    width: pTd(40),
    height: pTd(40),
    marginRight: pTd(16),
    borderRadius: pTd(20),
  },
  right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});
