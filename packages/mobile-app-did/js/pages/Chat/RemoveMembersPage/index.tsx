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
import { useCurrentChannelId } from '../context/hooks';
import { useGroupChannelInfo, useRemoveChannelMembers } from '@portkey-wallet/hooks/hooks-ca/im';
import { ChannelMemberInfo } from '@portkey-wallet/im/types/index';
import NoData from 'components/NoData';
import { BGStyles } from 'assets/theme/styles';
import ActionSheet from 'components/ActionSheet';
import navigationService from 'utils/navigationService';

const RemoveMembersPage = () => {
  const currentChannelId = useCurrentChannelId();
  const { groupInfo } = useGroupChannelInfo(currentChannelId || '', false);
  const { members = [] } = groupInfo || {};
  const removeMembers = useRemoveChannelMembers(currentChannelId || '');

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 200);
  const [filterMembers, setFilterMembers] = useState<ChannelMemberInfo[]>([]);

  const [selectedMemberMap, setSelectedMemberMap] = useState<Map<string, string>>(new Map());

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
    ActionSheet.alert({
      title: 'Remove these members ?',
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
              // TODO: test it
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
    try {
      let result = [];
      if (debounceKeyword) {
        result = members.filter(ele => ele.name.toLocaleUpperCase().includes(debounceKeyword) && !ele.isAdmin);
      } else {
        result = members.filter(ele => !ele.isAdmin);
      }
      setFilterMembers(result);
    } catch (error) {
      CommonToast.failError(error);
    }
  }, [debounceKeyword, members]);

  return (
    <PageContainer
      titleDom="Remove Members"
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
        data={filterMembers || []}
        extraData={(item: ChannelMemberInfo) => item.relationId}
        ListEmptyComponent={<NoData noPic message="No search result" style={BGStyles.bg4} />}
        renderItem={({ item }) => (
          <GroupMemberItem
            selected={selectedMemberMap.has(item.relationId)}
            item={{ title: item.name, relationId: item.relationId }}
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
