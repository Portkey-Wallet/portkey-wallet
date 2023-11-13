import React, { useCallback, useEffect, useState } from 'react';
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

const AddMembersPage = () => {
  const currentChannelId = useCurrentChannelId();
  const { groupInfo } = useGroupChannelInfo(currentChannelId || '');
  const { members = [] } = groupInfo || {};
  const addMembers = useAddChannelMembers(currentChannelId || '');

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 800);

  const { selectedItemsMap: selectedMemberMap, onPressItem } = useSelectedItemsMap<GroupMemberItemType>();

  const searchContactList = useLocalContactSearch();
  const [filterMemberList, setFilterMemberList] = useState<ContactItemType[]>([]);
  const [memberRelationIdMap, setMemberRelationIdMap] = useState<{ [id: string]: string }>({});

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
      navigationService.goBack();
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [addMembers, selectedMemberMap]);

  useEffect(() => {
    try {
      const { contactFilterList } = searchContactList(debounceKeyword, ContactsTab.Chats);
      setFilterMemberList(contactFilterList);
    } catch (error) {
      console.log(error);
    }
  }, [debounceKeyword, members, searchContactList]);

  useEffectOnce(() => {
    setMemberRelationIdMap(preMap => {
      const idMap: { [id: string]: string } = {};
      members.forEach(ele => {
        idMap[ele.relationId] = ele.relationId;
      });
      return { ...preMap, ...idMap };
    });
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
        data={filterMemberList}
        keyExtractor={(item: ContactItemType) => item.imInfo?.relationId || ''}
        ListEmptyComponent={<NoData noPic message={debounceKeyword ? 'No search found' : 'No Member'} />}
        renderItem={({ item }) => (
          <GroupMemberItem
            disabled={!!memberRelationIdMap[item.imInfo?.relationId || '']}
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
