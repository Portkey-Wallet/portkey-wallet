import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import GroupMemberItem from '../components/GroupMemberItem';
import CommonInput from 'components/CommonInput';
import useDebounce from 'hooks/useDebounce';
import CommonToast from 'components/CommonToast';
import NoData from 'components/NoData';
import CommonButton from 'components/CommonButton';
import Loading from 'components/Loading';
import { useCurrentChannelId } from '../context/hooks';
import { useGroupChannelInfo, useTransferChannelOwner } from '@portkey-wallet/hooks/hooks-ca/im';
import { ChannelMemberInfo } from '@portkey-wallet/im/types/index';
import ActionSheet from 'components/ActionSheet';
import navigationService from 'utils/navigationService';
import useEffectOnce from 'hooks/useEffectOnce';
import { strIncludes } from '@portkey-wallet/utils';

const TransferOwnershipPage = () => {
  const currentChannelId = useCurrentChannelId();
  const { groupInfo } = useGroupChannelInfo(currentChannelId || '', false);
  const { members = [] } = groupInfo || {};
  const [rawMemberList, setRawMemberList] = useState<ChannelMemberInfo[]>([]);

  const transferOwner = useTransferChannelOwner(currentChannelId || '');

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 200);
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>();
  const [filterMembers, setFilterMembers] = useState<ChannelMemberInfo[]>([]);

  useEffect(() => {
    setFilterMembers(() => {
      let result = [];
      if (debounceKeyword) {
        result = rawMemberList.filter(ele => strIncludes(ele.name, debounceKeyword) && !ele.isAdmin);
      } else {
        result = rawMemberList.filter(ele => !ele.isAdmin);
      }
      return [...result];
    });
  }, [debounceKeyword, rawMemberList]);

  const onPressItem = useCallback(
    (id: string) => {
      if (selectedMemberId === id) {
        setSelectedMemberId(undefined);
      } else {
        setSelectedMemberId(id);
      }
    },
    [selectedMemberId],
  );

  const onConfirm = useCallback(() => {
    ActionSheet.alert({
      title: 'Are you sure to transfer group ownership to others?',
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
              await transferOwner(selectedMemberId || '');
              CommonToast.success('Owner changed');
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
  }, [selectedMemberId, transferOwner]);

  useEffectOnce(() => {
    setRawMemberList([...members]);
  });

  return (
    <PageContainer
      titleDom="Transfer Group Ownership"
      safeAreaColor={['blue', 'white']}
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
        data={filterMembers}
        extraData={(item: ChannelMemberInfo) => item.relationId}
        ListEmptyComponent={<NoData noPic message={debounceKeyword ? 'No search result' : 'No member'} />}
        renderItem={({ item }) => (
          <GroupMemberItem
            key={item.relationId}
            multiple={false}
            item={{
              title: item.name,
              relationId: item.relationId,
              avatar: item.avatar,
            }}
            selected={item.relationId === selectedMemberId}
            onPress={onPressItem}
          />
        )}
      />

      <View style={styles.buttonWrap}>
        <CommonButton title="Confirm" type="primary" disabled={!selectedMemberId} onPress={onConfirm} />
      </View>
    </PageContainer>
  );
};

export default TransferOwnershipPage;

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
