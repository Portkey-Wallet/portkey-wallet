import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import GroupMemberItem, { GroupMemberItemType } from '../components/GroupMemberItem';
import CommonInput from 'components/CommonInput';
import useDebounce from 'hooks/useDebounce';
import CommonToast from 'components/CommonToast';
import CommonButton from 'components/CommonButton';
import NoData from 'components/NoData';
import Loading from 'components/Loading';
import { useAddChannelMembers, useGroupChannelInfo } from '@portkey-wallet/hooks/hooks-ca/im';
import { useCurrentChannelId } from '../context/hooks';
import { useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contact';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import navigationService from 'utils/navigationService';
import useEffectOnce from 'hooks/useEffectOnce';
import { useSelectedItemsMap } from '@portkey-wallet/hooks/hooks-ca/chat';
import im, { IChannelContactItem } from '@portkey-wallet/im';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import LottieLoading from 'components/LottieLoading';
import { pTd } from 'utils/unit';
import { SEARCH_MEMBER_LIST_LIMIT } from '@portkey-wallet/constants/constants-ca/im';

const AddMembersPage = () => {
  const currentChannelId = useCurrentChannelId();
  const { refresh } = useGroupChannelInfo(currentChannelId || '');
  const addMembers = useAddChannelMembers(currentChannelId || '');
  const searchContactList = useLocalContactSearch();
  const { selectedItemsMap: selectedMemberMap, onPressItem } = useSelectedItemsMap<GroupMemberItemType>();

  const pagination = useRef<{
    skipCount: number;
    maxResultCount: number;
  }>({
    skipCount: 0,
    maxResultCount: 20,
  });

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 800);

  const [initializing, setInitializing] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [contactList, setContactList] = useState<IChannelContactItem[]>([]);

  const [memberList, setMemberList] = useState<IChannelContactItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredMemberList, setFilteredMemberList] = useState<IChannelContactItem[]>([]);

  const listShow = useMemo(() => {
    if (initializing) return contactList;
    return debounceKeyword ? filteredMemberList : memberList;
  }, [contactList, debounceKeyword, filteredMemberList, initializing, memberList]);

  const onAdd = useCallback(async () => {
    try {
      Loading.show();
      const list = Array.from(selectedMemberMap.values()).map(ele => ({
        ...ele,
        name: ele.title,
        isAdmin: false,
        avatar: '',
      }));
      await addMembers(list);
      await refresh();
      navigationService.goBack();
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [addMembers, refresh, selectedMemberMap]);

  const getContactMemberList = useLockCallback(
    async (isInit: boolean) => {
      if (!isInit && totalCount && memberList.length >= totalCount) return;

      try {
        const result = await im.service.getChannelContacts({
          channelUuid: currentChannelId || '',
          skipCount: isInit ? 0 : pagination.current.skipCount,
          maxResultCount: pagination.current.maxResultCount,
        });
        setMemberList(per => (isInit ? result.data.contacts : [...per, ...result.data.contacts]));
        setTotalCount(result.data.totalCount);

        setInitializing(false);

        pagination.current.skipCount = isInit
          ? pagination.current.maxResultCount
          : pagination.current.skipCount + result.data.contacts.length;
      } catch (error) {
        console.log('err', error);
      }
    },
    [currentChannelId, memberList.length, totalCount],
  );

  const getFilteredContactMemberList = useLockCallback(async () => {
    if (!debounceKeyword.trim()) return;

    try {
      setIsSearching(true);
      const result = await im.service.getChannelContacts({
        channelUuid: currentChannelId || '',
        keyword: debounceKeyword,
        skipCount: 0,
        maxResultCount: SEARCH_MEMBER_LIST_LIMIT,
      });

      setFilteredMemberList(result.data.contacts);
      setInitializing(false);
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      setIsSearching(false);
    }
  }, [currentChannelId, debounceKeyword]);

  useEffect(() => {
    getFilteredContactMemberList();
  }, [getFilteredContactMemberList]);

  useEffectOnce(() => {
    getContactMemberList(true);
  });

  useEffectOnce(() => {
    const { contactFilterList } = searchContactList('', ContactsTab.Chats);
    setContactList(contactFilterList.slice(0, 20) as IChannelContactItem[]);
  });

  return (
    <PageContainer
      titleDom="Add Members"
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
        data={listShow}
        keyExtractor={(item: ContactItemType) => item.imInfo?.relationId || ''}
        ListEmptyComponent={
          isSearching ? (
            <LottieLoading lottieWrapStyle={GStyles.marginTop(pTd(24))} />
          ) : (
            <NoData noPic message={debounceKeyword ? 'No search found' : 'No Member'} />
          )
        }
        renderItem={({ item }) => (
          <GroupMemberItem
            disabled={initializing || item?.isGroupMember}
            key={item.id}
            selected={!!selectedMemberMap.has(item.imInfo?.relationId || '')}
            item={{
              title: item.name || item.caHolderInfo?.walletName || item.imInfo?.name || '',
              relationId: item.imInfo?.relationId || '',
              avatar: item.avatar || '',
            }}
            onPress={onPressItem}
          />
        )}
        onEndReached={() => getContactMemberList()}
      />
      <View style={styles.buttonWrap}>
        <CommonButton disabled={selectedMemberMap.size === 0} title="Save" type="primary" onPress={onAdd} />
      </View>
    </PageContainer>
  );
};

export default AddMembersPage;

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
