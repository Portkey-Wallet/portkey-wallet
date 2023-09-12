import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import GroupMemberItem from '../components/GroupMemberItem';
import CommonInput from 'components/CommonInput';
import useDebounce from 'hooks/useDebounce';
import CommonToast from 'components/CommonToast';
import CommonButton from 'components/CommonButton';
import NoData from 'components/NoData';
import Loading from 'components/Loading';
import { useGroupChannelInfo } from '@portkey-wallet/hooks/hooks-ca/im';
import { useCurrentChannelId } from '../context/hooks';
import { ChannelMemberInfo } from '@portkey-wallet/im/types/index';

const AddMembersPage = () => {
  const currentChannelId = useCurrentChannelId();
  const { groupInfo } = useGroupChannelInfo(currentChannelId || '', false);
  const { members = [] } = groupInfo || {};

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 800);

  const [filterMemberList, setFilterMemberList] = useState<ChannelMemberInfo[]>([]);
  const [selectedMemberMap, setSelectedMemberMap] = useState<Map<string, string>>(new Map());

  const onPressItem = useCallback((id: string) => {
    console.log('id', id);

    setSelectedMemberMap(pre => {
      if (pre.has(id)) {
        const newMap = new Map(pre);
        newMap.delete(id);
        return newMap;
      } else {
        const newMap = new Map(pre);
        newMap.set(id, id);
        return newMap;
      }
    });
  }, []);

  const onAdd = useCallback(() => {
    //TODO: save
    try {
      Loading.show();
      const list = Array.from(selectedMemberMap.keys());
      console.log('list', list);
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [selectedMemberMap]);

  useEffect(() => {
    try {
      let result = [];
      if (debounceKeyword) {
        result = members.filter(ele => ele.name.toLocaleUpperCase().includes(debounceKeyword) && !ele.isAdmin);
      } else {
        result = members.filter(ele => !ele.isAdmin);
      }
      setFilterMemberList(result);
    } catch (error) {
      CommonToast.failError(error);
    }
  }, [debounceKeyword, members]);

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
          debounceKeyword ? <NoData noPic message="No search found" /> : <NoData noPic message="No Member" />
        }
        renderItem={({ item }) => (
          <GroupMemberItem
            key={item.relationId}
            selected={!!selectedMemberMap.has(item.relationId)}
            item={{
              title: item.name,
              relationId: item.relationId,
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
