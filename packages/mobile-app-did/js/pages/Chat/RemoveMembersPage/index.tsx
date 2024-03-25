import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import GroupMemberItem, { GroupMemberItemType } from '../components/GroupMemberItem';
import CommonInput from 'components/CommonInput';
import useDebounce from 'hooks/useDebounce';
import CommonToast from 'components/CommonToast';
import CommonButton from 'components/CommonButton';
import Loading from 'components/Loading';
import { useCurrentChannelId } from '../context/hooks';
import { useGroupChannelInfo, useRemoveChannelMembers } from '@portkey-wallet/hooks/hooks-ca/im';
import { ChannelMemberInfo } from '@portkey-wallet/im/types/index';
import NoData from 'components/NoData';
import ActionSheet from 'components/ActionSheet';
import navigationService from 'utils/navigationService';
import useEffectOnce from 'hooks/useEffectOnce';
import { useSelectedItemsMap } from '@portkey-wallet/hooks/hooks-ca/chat';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import im from '@portkey-wallet/im';
import LottieLoading from 'components/LottieLoading';
import { pTd } from 'utils/unit';

const RemoveMembersPage = () => {
  const currentChannelId = useCurrentChannelId();
  const { groupInfo, refresh, refreshChannelMembersInfo } = useGroupChannelInfo(currentChannelId || '', false);
  const { members = [], totalCount } = groupInfo || {};

  const removeMembers = useRemoveChannelMembers(currentChannelId || '');

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 800);
  const [isSearching, setIsSearching] = useState(false);
  const [filterMembers, setFilterMembers] = useState<ChannelMemberInfo[]>([]);
  const { selectedItemsMap: selectedMemberMap, onPressItem } = useSelectedItemsMap<GroupMemberItemType>();

  const listShow = useMemo(() => {
    return debounceKeyword ? filterMembers.slice(1) : members?.slice(1);
  }, [debounceKeyword, filterMembers, members]);

  const onRemove = useCallback(() => {
    ActionSheet.alert({
      title: 'Remove these members from the group?',
      buttons: [
        {
          title: 'No',
          type: 'outline',
        },
        {
          title: 'Yes',
          onPress: async () => {
            try {
              Loading.show();
              const result = Array.from(selectedMemberMap.keys());
              await removeMembers(result || []);
              await refresh();
              navigationService.goBack();
            } catch (error) {
              CommonToast.failError(error);
            } finally {
              Loading.hide();
            }
          },
        },
      ],
    });
  }, [refresh, removeMembers, selectedMemberMap]);

  const searchMemberList = useLockCallback(async () => {
    if (!debounceKeyword.trim()) return;
    setIsSearching(true);

    try {
      const result = await im.service.searchChannelMembers({
        channelUuid: currentChannelId,
        keyword: debounceKeyword,
      });
      setFilterMembers(result?.data.members || []);
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      setIsSearching(false);
    }
  }, [currentChannelId, debounceKeyword]);

  const fetchMemberList = useLockCallback(
    async (isInit?: false) => {
      if (debounceKeyword.trim()) return;
      if (totalCount && members?.length >= totalCount && !isInit) return;

      try {
        await refreshChannelMembersInfo(members?.length || 0);
      } catch (error) {
        console.log('fetchMoreData', error);
      }
    },
    [debounceKeyword, members?.length, refreshChannelMembersInfo, totalCount],
  );

  // keyword search
  useEffect(() => {
    searchMemberList();
  }, [debounceKeyword, members, searchMemberList]);

  useEffectOnce(() => {
    fetchMemberList(true);
  });

  return (
    <PageContainer
      titleDom="Remove Members"
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <View style={styles.inputWrap}>
        <CommonInput
          allowClear
          value={keyword}
          placeholder={'Search members'}
          onChangeText={v => {
            setKeyword(v.trim());
          }}
        />
      </View>

      <FlatList
        data={listShow || []}
        keyExtractor={(item: ChannelMemberInfo) => item.relationId}
        ListEmptyComponent={
          isSearching ? (
            <LottieLoading lottieWrapStyle={GStyles.marginTop(pTd(24))} />
          ) : (
            <NoData noPic message="No search result" />
          )
        }
        renderItem={({ item }) => (
          <GroupMemberItem
            selected={selectedMemberMap.has(item.relationId)}
            item={{ title: item.name, relationId: item.relationId, avatar: item.avatar }}
            onPress={onPressItem}
          />
        )}
        onEndReached={() => fetchMemberList()}
      />
      <View style={styles.buttonWrap}>
        <CommonButton disabled={selectedMemberMap.size === 0} title="Remove" type="primary" onPress={onRemove} />
      </View>
    </PageContainer>
  );
};

export default RemoveMembersPage;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg1,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  inputWrap: {
    backgroundColor: defaultColors.bg5,
    ...GStyles.paddingArg(8, 20, 8),
  },
  buttonWrap: {
    ...GStyles.marginArg(10, 20, 16),
  },
});
