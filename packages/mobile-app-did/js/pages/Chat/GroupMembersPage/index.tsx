import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonInput from 'components/CommonInput';
import useDebounce from 'hooks/useDebounce';
import GroupInfoMemberItem, { GroupInfoMemberItemType } from '../components/GroupInfoMemberItem';
import { pTd } from 'utils/unit';
import NoData from 'components/NoData';
import { useGroupChannelInfo, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import { useCurrentChannelId } from '../context/hooks';
import { BGStyles } from 'assets/theme/styles';
import navigationService from 'utils/navigationService';
import { useEffectOnce } from '@portkey-wallet/hooks';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import im from '@portkey-wallet/im';
import CommonToast from 'components/CommonToast';
import LottieLoading from 'components/LottieLoading';
import { SEARCH_MEMBER_LIST_LIMIT } from '@portkey-wallet/constants/constants-ca/im';

const GroupMembersPage = () => {
  const { relationId: myRelationId } = useRelationId();
  const currentChannelId = useCurrentChannelId();
  const { groupInfo, refreshChannelMembersInfo } = useGroupChannelInfo(currentChannelId || '', false);
  const { members = [], totalCount } = groupInfo || {};

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 800);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredMemberList, setFilteredMemberList] = useState(members);

  const listShow = useMemo(() => {
    return debounceKeyword ? filteredMemberList : members;
  }, [debounceKeyword, filteredMemberList, members]);

  const onPressItem = useCallback(
    (item: GroupInfoMemberItemType) => {
      if (myRelationId === item.relationId) {
        navigationService.navigate('WalletName');
      } else {
        navigationService.navigate('ChatContactProfile', {
          relationId: item.relationId,
          contact: {
            name: item?.title,
          },
        });
      }
    },
    [myRelationId],
  );

  const searchMemberList = useLockCallback(async () => {
    if (!debounceKeyword.trim()) return;
    setIsSearching(true);

    try {
      const result = await im.service.searchChannelMembers({
        channelUuid: currentChannelId,
        keyword: debounceKeyword,
        skipCount: 0,
        maxResultCount: SEARCH_MEMBER_LIST_LIMIT,
      });
      setFilteredMemberList(result?.data.members || []);
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
        await refreshChannelMembersInfo(isInit ? 0 : members?.length || 0);
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
      titleDom="Members"
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
        ListEmptyComponent={
          isSearching ? (
            <LottieLoading lottieWrapStyle={GStyles.marginTop(pTd(24))} />
          ) : (
            <NoData noPic message="No search result" style={BGStyles.bg1} />
          )
        }
        keyExtractor={item => item.relationId}
        renderItem={({ item }) => (
          <GroupInfoMemberItem
            item={{
              relationId: item.relationId,
              title: item.name,
              avatar: item.avatar,
            }}
            isOwner={item.isAdmin}
            onPress={onPressItem}
            style={styles.itemStyle}
          />
        )}
        onEndReached={() => fetchMemberList()}
      />
    </PageContainer>
  );
};

export default GroupMembersPage;

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
  itemStyle: {
    paddingHorizontal: pTd(20),
  },
  buttonWrap: {
    ...GStyles.marginArg(10, 20, 16),
  },
});
