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
import { useGroupChannelInfo, useRelationId, useTransferChannelOwner } from '@portkey-wallet/hooks/hooks-ca/im';
import { ChannelMemberInfo } from '@portkey-wallet/im/types/index';
import ActionSheet from 'components/ActionSheet';
import navigationService from 'utils/navigationService';
import useEffectOnce from 'hooks/useEffectOnce';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import im from '@portkey-wallet/im';
import LottieLoading from 'components/LottieLoading';
import { pTd } from 'utils/unit';
import { SEARCH_MEMBER_LIST_LIMIT } from '@portkey-wallet/constants/constants-ca/im';

const TransferOwnershipPage = () => {
  const { relationId: myRelationId } = useRelationId();

  const currentChannelId = useCurrentChannelId();
  const { groupInfo, refreshChannelMembersInfo } = useGroupChannelInfo(currentChannelId || '', false);
  const { members = [], totalCount } = groupInfo || {};

  const transferOwner = useTransferChannelOwner(currentChannelId || '');

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 800);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>();
  const [filterMembers, setFilterMembers] = useState<ChannelMemberInfo[]>(members);

  const listShow = useMemo(() => {
    return debounceKeyword ? filterMembers.filter(ele => ele.relationId !== myRelationId) : members?.slice(1);
  }, [debounceKeyword, filterMembers, members, myRelationId]);

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
    if (!debounceKeyword.trim()) return;
    setIsSearching(false);

    try {
      const result = await im.service.searchChannelMembers({
        channelUuid: currentChannelId,
        keyword: debounceKeyword,
        skipCount: 0,
        maxResultCount: SEARCH_MEMBER_LIST_LIMIT,
      });
      setFilterMembers(result?.data.members || []);
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      setIsSearching(false);
    }
  }, [currentChannelId, debounceKeyword]);

  const fetchMemberList = useCallback(
    async (isInit?: boolean) => {
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
              title: item.name,
              relationId: item.relationId,
              avatar: item.avatar,
            }}
            selected={item.relationId === selectedMemberId}
            onPress={onPressItem}
          />
        )}
        onEndReached={() => fetchMemberList()}
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
