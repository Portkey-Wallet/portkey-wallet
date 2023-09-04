import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import GroupMemberItem from '../components/GroupMemberItem';
import CommonInput from 'components/CommonInput';
import useDebounce from 'hooks/useDebounce';
import CommonToast from 'components/CommonToast';
import LottieLoading from 'components/LottieLoading';
import NoData from 'components/NoData';
import CommonButton from 'components/CommonButton';
import Loading from 'components/Loading';
const list = [{ name: '11', id: '1111' }];

const TransferOwnershipPage = () => {
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debounceKeyword = useDebounce(keyword, 800);
  const [memberList] = useState(list);
  const [selectedMemberId, setSelectedMemberId] = useState('');

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

  const onPressItem = useCallback(
    (id: string) => {
      if (selectedMemberId === id) return;
      setSelectedMemberId(id);
    },
    [selectedMemberId],
  );

  const onConfirm = useCallback(() => {
    try {
      Loading.show();
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, []);

  return (
    <PageContainer
      titleDom="Transfer Ownership"
      safeAreaColor={['blue', 'gray']}
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
        data={memberList}
        // TODO: any Type
        extraData={(item: any) => item.id}
        ListEmptyComponent={isSearching ? <LottieLoading /> : <NoData noPic message="No search result" />}
        renderItem={({ item }) => (
          <GroupMemberItem multiple={false} item={item} selected={item.id === selectedMemberId} onPress={onPressItem} />
        )}
      />

      <View style={styles.buttonWrap}>
        <CommonButton title="Confirm" type="primary" onPress={onConfirm} />
      </View>
    </PageContainer>
  );
};

export default TransferOwnershipPage;

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
