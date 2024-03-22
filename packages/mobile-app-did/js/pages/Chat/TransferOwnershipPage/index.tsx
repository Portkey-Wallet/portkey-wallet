import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import GroupMemberItem from '../components/GroupMemberItem';
import CommonInput from 'components/CommonInput';
import useDebounce from 'hooks/useDebounce';
import CommonToast from 'components/CommonToast';
import NoData from 'components/NoData';
import CommonButton from 'components/CommonButton';
import Loading from 'components/Loading';
import { useCurrentChannelId } from '../context/hooks';
import { useGroupChannelInfo, useTransferChannelOwner } from '@portkey-wallet/hooks/hooks-ca/im';
import { ChannelMemberInfo } from '@portkey-wallet/im/types/index';
import ActionSheet from 'components/ActionSheet';
import navigationService from 'utils/navigationService';
import useEffectOnce from 'hooks/useEffectOnce';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import im from '@portkey-wallet/im';

const TransferOwnershipPage = () => {
  const currentChannelId = useCurrentChannelId();
  const { groupInfo, refreshChannelMembersInfo } = useGroupChannelInfo(currentChannelId || '', false);
  const { members = [], totalCount } = groupInfo || {};

  const transferOwner = useTransferChannelOwner(currentChannelId || '');

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 200);
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>();
  const [filterMembers, setFilterMembers] = useState<ChannelMemberInfo[]>(members);

  const listShow = useMemo(() => filterMembers.slice(1), [filterMembers]);

  const onPressItem = useCallback(
    (id: string) => {
      if (selectedMemberId === id) {
        setSelectedMemberId(undefined);
      } else {
        setSelectedMemberId(id);
      }
    },
    [selectedMemberId],
  );

  const onConfirm = useCallback(() => {
    ActionSheet.alert({
      title: 'Are you sure to transfer group ownership to others?',
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
              await transferOwner(selectedMemberId || '');
              CommonToast.success('Owner changed');
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
  }, [selectedMemberId, transferOwner]);

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
      titleDom="Transfer Group Ownership"
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <View style={styles.inputWrap}>
        <CommonInput
          allowClear
          // loading={isSearching}
          value={keyword}
          placeholder={'Search'}
          onChangeText={v => {
            setKeyword(v.trim());
          }}
        />
      </View>

      <FlatList
        data={listShow}
        extraData={(item: ChannelMemberInfo) => item.relationId}
        ListEmptyComponent={<NoData noPic message={debounceKeyword ? 'No search result' : 'No member'} />}
        renderItem={({ item }) => (
          <GroupMemberItem
            key={item.relationId}
            multiple={false}
            item={{
              title: item.name,
              relationId: item.relationId,
              avatar: item.avatar,
            }}
            selected={item.relationId === selectedMemberId}
            onPress={onPressItem}
          />
        )}
        onEndReached={fetchMemberList}
      />

      <View style={styles.buttonWrap}>
        <CommonButton title="Confirm" type="primary" disabled={!selectedMemberId} onPress={onConfirm} />
      </View>
    </PageContainer>
  );
};

export default TransferOwnershipPage;

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
