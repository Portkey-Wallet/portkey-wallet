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
import Loading from 'components/Loading';
import { useCurrentChannelId } from '../context/hooks';
import { useGroupChannelInfo, useRemoveChannelMembers } from '@portkey-wallet/hooks/hooks-ca/im';
import { ChannelMemberInfo } from '@portkey-wallet/im/types/index';
import NoData from 'components/NoData';
import ActionSheet from 'components/ActionSheet';
import navigationService from 'utils/navigationService';
import useEffectOnce from 'hooks/useEffectOnce';
import { strIncludes } from '@portkey-wallet/utils';
import { useSelectedItemsMap } from '@portkey-wallet/hooks/hooks-ca/chat';

const RemoveMembersPage = () => {
  const currentChannelId = useCurrentChannelId();
  const { groupInfo } = useGroupChannelInfo(currentChannelId || '', false);
  const { members = [] } = groupInfo || {};
  const removeMembers = useRemoveChannelMembers(currentChannelId || '');

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 200);
  const [rawMemberList, setRawMemberList] = useState<ChannelMemberInfo[]>([]);
  const [filterMembers, setFilterMembers] = useState<ChannelMemberInfo[]>([]);
  const { selectedItemsMap: selectedMemberMap, onPressItem } = useSelectedItemsMap<GroupMemberItemType>();

  const onRemove = useCallback(() => {
    ActionSheet.alert({
      title: 'Remove these members from the group?',
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
              const result = Array.from(selectedMemberMap.keys());
              await removeMembers(result || []);
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
  }, [removeMembers, selectedMemberMap]);

  useEffect(() => {
    setFilterMembers(() => {
      let result = [];
      if (debounceKeyword) {
        result = rawMemberList.filter(ele => strIncludes(ele.name, debounceKeyword) && !ele.isAdmin);
      } else {
        result = rawMemberList.filter(ele => !ele.isAdmin);
      }
      return result;
    });
  }, [debounceKeyword, rawMemberList]);

  useEffectOnce(() => {
    setRawMemberList([...members]);
  });

  return (
    <PageContainer
      titleDom="Remove Members"
      safeAreaColor={['blue', 'white']}
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
        data={filterMembers || []}
        keyExtractor={(item: ChannelMemberInfo) => item.relationId}
        ListEmptyComponent={<NoData noPic message="No search result" />}
        renderItem={({ item }) => (
          <GroupMemberItem
            selected={selectedMemberMap.has(item.relationId)}
            item={{ title: item.name, relationId: item.relationId, avatar: item.avatar }}
            onPress={onPressItem}
          />
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
