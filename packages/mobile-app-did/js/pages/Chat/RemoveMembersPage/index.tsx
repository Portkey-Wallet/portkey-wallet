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
import Loading from 'components/Loading';

const list = [{ name: '11', id: '1111' }];

const RemoveMembersPage = () => {
  const [keyword, setKeyword] = useState('');
  const [, setIsSearching] = useState(false);
  const debounceKeyword = useDebounce(keyword, 800);
  const [selectedMemberMap, setSelectedMemberMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    // TODO: fetch

    try {
      setIsSearching(true);
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      setIsSearching(true);
    }
  }, [debounceKeyword]);

  const onPressItem = useCallback((id: string) => {
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

  const onRemove = useCallback(() => {
    //TODO: save
    try {
      Loading.show();
      const result = Array.from(selectedMemberMap.keys());
      console.log('list', result);
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [selectedMemberMap]);

  return (
    <PageContainer
      titleDom="Remove Members"
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <View style={styles.inputWrap}>
        <CommonInput
          allowClear
          // loading={isSearching}
          value={keyword}
          placeholder={'Search members'}
          onChangeText={v => {
            setKeyword(v.trim());
          }}
        />
      </View>

      <FlatList
        data={list}
        // TODO: any Type
        extraData={(item: any) => item.id}
        renderItem={({ item }) => (
          <GroupMemberItem selected={selectedMemberMap.has(item.id)} item={item} onPress={onPressItem} />
        )}
      />

      <View style={styles.buttonWrap}>
        <CommonButton disabled={selectedMemberMap.size === 0} title="Remove" type="primary" onPress={onRemove} />
      </View>
    </PageContainer>
  );
};

export default RemoveMembersPage;

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
