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
const memberList = [
  { name: '11', id: '1111' },
  { name: '222', id: '2222' },
];

const AddMembersPage = () => {
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debounceKeyword = useDebounce(keyword, 800);

  const [filterMemberList, setFilterMemberList] = useState(memberList);
  const [selectedMemberMap, setSelectedMemberMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    try {
      setIsSearching(true);
      // TODO: fetch
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      setIsSearching(true);
    }
  }, [debounceKeyword]);

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
        // TODO: any Type
        extraData={(item: any) => item.id}
        ListEmptyComponent={
          debounceKeyword ? <NoData noPic message="No search found" /> : <NoData noPic message="No Member" />
        }
        renderItem={({ item }) => (
          <GroupMemberItem
            key={item.id}
            selected={!!selectedMemberMap.has(item.id)}
            item={item}
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
