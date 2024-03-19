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
import { useUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import im from '@portkey-wallet/im';

const SelectGroupMembersToTransferPage = () => {
  const currentChannelId = useCurrentChannelId();
  const { groupInfo, refreshChannelMembersInfo } = useGroupChannelInfo(currentChannelId || '', false);

  const { userId: myUserId } = useUserInfo() || {};
  const { memberInfos } = groupInfo || {};
  const { members = [], totalCount } = memberInfos || {};
  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 200);
  const [filterMembers, setFilterMembers] = useState<ChannelMemberInfo[]>([]);

  // TODO: filter myself
  const listShow = useMemo(() => filterMembers.filter(ele => ele.userId !== myUserId), [filterMembers, myUserId]);

  const channelId = useCurrentChannelId();

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
    if (!keyword.trim()) return;
    try {
      const result = await im.service.searchChannelMembers({
        channelUuid: currentChannelId,
        keyword,
      });
      setFilterMembers(result?.data.members || []);
    } catch (error) {
      // TODO: change
      console.log('error', error);
    }
  }, [currentChannelId, keyword]);

  const fetchMemberList = useLockCallback(
    async (isInit?: false) => {
      if (!keyword.trim() && !isInit) return;
      if (totalCount && filterMembers?.length >= totalCount) return;

      try {
        await refreshChannelMembersInfo(filterMembers?.length || 0);
      } catch (error) {
        console.log('fetchMoreData', error);
      }
    },
    [filterMembers?.length, keyword, refreshChannelMembersInfo, totalCount],
  );

  // keyword search
  useEffect(() => {
    searchMemberList();
  }, [debounceKeyword, keyword, members, searchMemberList]);

  useEffectOnce(() => {
    fetchMemberList(true);
  });

  return (
    <PageContainer
      titleDom="Select Recipient"
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <View style={styles.inputWrap}>
        <CommonInput
          allowClear
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
        ListEmptyComponent={<NoData noPic message={debounceKeyword ? 'No search result' : 'No member'} />}
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
    backgroundColor: defaultColors.bg5,
    ...GStyles.paddingArg(8, 20, 8),
  },
  buttonWrap: {
    ...GStyles.marginArg(10, 20, 16),
  },
});
