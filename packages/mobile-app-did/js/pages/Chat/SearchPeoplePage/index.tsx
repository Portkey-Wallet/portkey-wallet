import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import InputWithCancel from 'components/InputWithCancel';
import { useFocusEffect } from '@react-navigation/native';
import NoData from 'components/NoData';
import { TextL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import FindMoreButton from '../components/FindMoreButton';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import CommonAvatar from 'components/CommonAvatar';
import { useSearchChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import useDebounce from 'hooks/useDebounce';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import CommonToast from 'components/CommonToast';
import { ChannelItem, ChannelTypeEnum } from '@portkey-wallet/im/types';
import { useJumpToChatDetails, useJumpToChatGroupDetails } from 'hooks/chat';
import { Input } from '@rneui/base';
import LottieLoading from 'components/LottieLoading';
import { getChatListSvgName } from '../utils';
import GroupAvatarShow from '../components/GroupAvatarShow';

export default function SearchPeople() {
  const iptRef = useRef<Input>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [loading, setLoading] = useState(false);
  const searchChannel = useSearchChannel();
  const navToChatDetails = useJumpToChatDetails();
  const navToGroupChatDetails = useJumpToChatGroupDetails();

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 500);
  const [filterList, setFilterList] = useState<ChannelItem[]>([]);

  const fetchList = useLockCallback(async () => {
    try {
      setLoading(true);
      const list = await searchChannel(debounceKeyword);
      setFilterList(list);
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      setLoading(false);
    }
  }, [debounceKeyword, searchChannel]);

  useEffect(() => {
    if (!debounceKeyword) return setFilterList([]);
    fetchList();
  }, [debounceKeyword, fetchList]);

  useFocusEffect(
    useCallback(() => {
      if (iptRef?.current) {
        timerRef.current = setTimeout(() => {
          iptRef.current?.focus();
        }, 300);
      }
    }, []),
  );

  useEffect(
    () => () => {
      if (timerRef?.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: ChannelItem }) => {
      const { toRelationId = '', channelUuid = '', displayName = '' } = item;

      const Avatar =
        item.channelType === ChannelTypeEnum.P2P ? (
          <CommonAvatar
            hasBorder
            avatarSize={pTd(36)}
            resizeMode="cover"
            style={styles.avatarStyle}
            imageUrl={item.channelIcon || ''}
            title={item.displayName}
            svgName={getChatListSvgName(item.channelType)}
          />
        ) : (
          <GroupAvatarShow
            logoSize={pTd(12)}
            avatarSize={pTd(36)}
            wrapStyle={styles.avatarStyle}
            imageUrl={item.channelIcon || ''}
            svgName={item.channelIcon ? undefined : 'chat-group-avatar'}
          />
        );

      return (
        <Touchable
          style={[GStyles.flexRow, GStyles.itemCenter, styles.itemWrap]}
          onPress={() => {
            if (item.channelType === ChannelTypeEnum.GROUP) return navToGroupChatDetails({ toRelationId, channelUuid });
            if (item.channelType === ChannelTypeEnum.P2P) return navToChatDetails({ toRelationId, channelUuid });
            return CommonToast.warn(
              'Downloading the latest Portkey for you. To proceed, please close and restart the App.',
            );
          }}>
          {Avatar}
          <View style={styles.rightSection}>
            <TextL numberOfLines={1}>{displayName}</TextL>
          </View>
        </Touchable>
      );
    },
    [navToChatDetails, navToGroupChatDetails],
  );

  return (
    <PageContainer
      hideHeader
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: true }}
      hideTouchable={true}
      containerStyles={styles.containerStyles}
      titleDom="Search">
      <InputWithCancel
        ref={iptRef as any}
        placeholder="Name in Chats"
        value={keyword}
        clearText={() => setKeyword('')}
        onChangeText={v => setKeyword(v)}
        onCancel={() => navigationService.goBack()}
      />
      <FindMoreButton />
      {loading ? (
        <LottieLoading />
      ) : (
        <FlatList
          data={filterList}
          keyExtractor={item => item.channelUuid}
          ListHeaderComponent={
            debounceKeyword && filterList.length > 0 ? <TextL style={styles.listHeader}>Chats</TextL> : null
          }
          ListEmptyComponent={debounceKeyword ? <NoData noPic message="No search result" /> : null}
          renderItem={renderItem}
        />
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg1,
    paddingHorizontal: 0,
    flex: 1,
  },
  listHeader: {
    ...GStyles.paddingArg(16, 20, 8),
    color: defaultColors.font9,
  },
  itemWrap: {
    width: screenWidth,
    height: pTd(72),
  },
  avatarStyle: {
    marginHorizontal: pTd(20),
    marginVertical: pTd(18),
  },
  rightSection: {
    height: pTd(72),
    flex: 1,
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingRight: pTd(20),
    justifyContent: 'center',
  },
});
