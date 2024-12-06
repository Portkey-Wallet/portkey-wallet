import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import GroupMemberItem, { GroupMemberItemType } from '../components/GroupMemberItem';
import CommonInput from 'components/CommonInput';
import useDebounce from 'hooks/useDebounce';
import NoData from 'components/NoData';
import { useCurrentChannelId } from '../context/hooks';
import { useGroupChannelInfo } from '@portkey-wallet/hooks/hooks-ca/im';
import { ChannelMemberInfo } from '@portkey-wallet/im/types/index';
import useEffectOnce from 'hooks/useEffectOnce';
import { showAssetList } from 'pages/DashBoard/AssetsOverlay';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import im from '@portkey-wallet/im';
import LottieLoading from 'components/LottieLoading';
import { pTd } from 'utils/unit';
import { SEARCH_MEMBER_LIST_LIMIT } from '@portkey-wallet/constants/constants-ca/im';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';

const SelectGroupMembersToTransferPage = () => {
  // todo: walletName is not used
  const currentChannelId = useCurrentChannelId();
  const { groupInfo, refreshChannelMembersInfo } = useGroupChannelInfo(currentChannelId || '', false);

  const channelId = useCurrentChannelId();
  const { userId: myUserId } = useCurrentUserInfo();
  const { members = [], totalCount } = groupInfo || {};
  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 800);
  const [isSearching, setIsSearching] = useState(false);

  const [filterMembers, setFilterMembers] = useState<ChannelMemberInfo[]>([]);

  // TODO: filter myself
  const listShow = useMemo(() => {
    const _list = debounceKeyword ? filterMembers : members;
    return _list.filter(ele => ele.userId !== myUserId);
  }, [debounceKeyword, filterMembers, members, myUserId]);

  const onPressItem = useCallback(
    (toRelationId: string, item: GroupMemberItemType) => {
      showAssetList({
        imTransferInfo: {
          isGroupChat: true,
          addresses: item.addresses || [],
          name: item.title,
          toUserId: item?.userId || '',
          channelId: channelId || '',
        },
      });
    },
    [channelId],
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
      setFilterMembers(result?.data.members || []);
    } catch (error) {
      // TODO: change
      console.log('error', error);
    } finally {
      setIsSearching(false);
    }
  }, [currentChannelId, debounceKeyword]);

  const fetchMemberList = useLockCallback(
    async (isInit?: false) => {
      if (debounceKeyword.trim()) return;

      if (!isInit && totalCount && members?.length >= totalCount) return;

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
      titleDom="Select Recipient"
      safeAreaColor={['white', 'white']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <View style={styles.inputWrap}>
        <CommonInput
          allowClear
          grayBorder
          theme="white-bg"
          value={keyword}
          placeholder={'Search'}
          onChangeText={v => {
            setKeyword(v.trim());
          }}
        />
      </View>

      <FlatList
        data={listShow || []}
        extraData={(item: ChannelMemberInfo) => item.relationId}
        ListEmptyComponent={
          isSearching ? (
            <LottieLoading lottieWrapStyle={GStyles.marginTop(pTd(24))} />
          ) : (
            <NoData noPic message={debounceKeyword ? 'No search result' : 'No member'} />
          )
        }
        renderItem={({ item }) => (
          <GroupMemberItem
            key={item.relationId}
            multiple={false}
            item={{
              ...item,
              title: item.name,
              relationId: item.relationId,
              avatar: item.avatar,
            }}
            selected={false}
            onPress={onPressItem}
          />
        )}
        onEndReached={() => fetchMemberList()}
      />
    </PageContainer>
  );
};

export default SelectGroupMembersToTransferPage;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg1,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  inputWrap: {
    backgroundColor: defaultColors.bg1,
    ...GStyles.paddingArg(0, 20, 8),
  },
  buttonWrap: {
    ...GStyles.marginArg(10, 20, 16),
  },
});
