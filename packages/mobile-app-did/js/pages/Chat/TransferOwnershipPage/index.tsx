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
import { BGStyles } from 'assets/theme/styles';
import ActionSheet from 'components/ActionSheet';
import navigationService from 'utils/navigationService';

const TransferOwnershipPage = () => {
  const currentChannelId = useCurrentChannelId();
  const { groupInfo } = useGroupChannelInfo(currentChannelId || '', false);
  const { members = [] } = groupInfo || {};
  const transferOwner = useTransferChannelOwner(currentChannelId || '');

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 200);
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>();
  const [filterMembers, setFilterMembers] = useState<ChannelMemberInfo[]>([]);

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
      title: 'Transfer ownership ?',
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
              CommonToast.success('transferred successfully');
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
  }, [selectedMemberId, transferOwner]);

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
        data={filterMembers}
        extraData={(item: ChannelMemberInfo) => item.relationId}
        ListEmptyComponent={<NoData noPic message="No search result" style={BGStyles.bg4} />}
        renderItem={({ item }) => (
          <GroupMemberItem
            multiple={false}
            item={{
              title: item.name,
              relationId: item.relationId,
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
