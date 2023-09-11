import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonInput from 'components/CommonInput';
import useDebounce from 'hooks/useDebounce';
import CommonToast from 'components/CommonToast';
import GroupInfoMemberItem from '../components/GroupInfoMemberItem';
import { pTd } from 'utils/unit';
import NoData from 'components/NoData';

const list = [{ title: '11', id: '1111' }];

const GroupMembersPage = () => {
  const [keyword, setKeyword] = useState('');
  const [, setIsSearching] = useState(false);
  const debounceKeyword = useDebounce(keyword, 800);
  const [filterMemberList] = useState(list);

  // search
  useEffect(() => {
    try {
      setIsSearching(true);
      // TODO: fetch
      // setFilterMemberList
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      setIsSearching(true);
    }
  }, [debounceKeyword]);

  return (
    <PageContainer
      titleDom="Members"
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <View style={styles.inputWrap}>
        <CommonInput
          allowClear
          value={keyword}
          placeholder={'Search members'}
          onChangeText={v => {
            setKeyword(v.trim());
          }}
        />
      </View>

      <FlatList
        data={filterMemberList}
        // TODO: any Type
        ListEmptyComponent={<NoData noPic message="No search result" />}
        extraData={(item: any) => item.id}
        renderItem={({ item }) => <GroupInfoMemberItem item={item} isOwner={true} style={styles.itemStyle} />}
      />
    </PageContainer>
  );
};

export default GroupMembersPage;

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
  itemStyle: {
    paddingHorizontal: pTd(20),
  },
  buttonWrap: {
    ...GStyles.marginArg(10, 20, 16),
  },
});
