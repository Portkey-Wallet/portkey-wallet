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
import NoData from 'components/NoData';
import Loading from 'components/Loading';
import { useAddChannelMembers, useGroupChannelInfo } from '@portkey-wallet/hooks/hooks-ca/im';
import { useCurrentChannelId } from '../context/hooks';
import { ChannelMemberInfo } from '@portkey-wallet/im/types/index';
import { useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contact';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
import { BGStyles } from 'assets/theme/styles';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import navigationService from 'utils/navigationService';

const AddMembersPage = () => {
  const currentChannelId = useCurrentChannelId();
  const { groupInfo } = useGroupChannelInfo(currentChannelId || '');
  const { members = [] } = groupInfo || {};
  const addMembers = useAddChannelMembers(currentChannelId || '');

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 800);

  const searchContactList = useLocalContactSearch();
  const [filterMemberList, setFilterMemberList] = useState<ContactItemType[]>([]);
  const [selectedMemberMap, setSelectedMemberMap] = useState<Map<string, GroupMemberItemType>>(new Map());

  const memberRelationIdMap = useMemo(() => {
    const idMap: { [id: string]: string } = {};
    members.forEach(ele => {
      idMap[ele.relationId] = ele.relationId;
    });
    return idMap;
  }, [members]);

  const onPressItem = useCallback((id: string, item: GroupMemberItemType) => {
    setSelectedMemberMap(pre => {
      if (pre.has(id)) {
        const newMap = new Map(pre);
        newMap.delete(id);
        return newMap;
      } else {
        const newMap = new Map(pre);
        newMap.set(id, item);
        return newMap;
      }
    });
  }, []);

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
      console.log('contactFilterList', contactFilterList);
    } catch (error) {
      CommonToast.failError(error);
    }
  }, [debounceKeyword, members, searchContactList]);

  return (
    <PageContainer
      titleDom="Add Members"
      safeAreaColor={['blue', 'gray']}
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
        extraData={(item: ChannelMemberInfo) => item.relationId}
        ListEmptyComponent={
          debounceKeyword ? (
            <NoData noPic message="No search found" style={BGStyles.bg4} />
          ) : (
            <NoData noPic message="No Member" style={BGStyles.bg4} />
          )
        }
        renderItem={({ item }) => (
          <GroupMemberItem
            disabled={!!memberRelationIdMap[item.imInfo?.relationId || '']}
            key={item.id}
            selected={!!selectedMemberMap.has(item.imInfo?.relationId || '')}
            item={{
              title: item.name || item.caHolderInfo?.walletName || item.imInfo?.name || '',
              relationId: item.imInfo?.relationId || '',
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
    backgroundColor: defaultColors.bg4,
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
