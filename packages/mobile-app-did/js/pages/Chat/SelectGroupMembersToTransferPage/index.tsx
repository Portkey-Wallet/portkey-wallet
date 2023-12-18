import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import GroupMemberItem from '../components/GroupMemberItem';
import CommonInput from 'components/CommonInput';
import useDebounce from 'hooks/useDebounce';
import NoData from 'components/NoData';
import { useCurrentChannelId } from '../context/hooks';
import { useGroupChannelInfo } from '@portkey-wallet/hooks/hooks-ca/im';
import { ChannelMemberInfo } from '@portkey-wallet/im/types/index';
import useEffectOnce from 'hooks/useEffectOnce';
import { strIncludes } from '@portkey-wallet/utils';
import { showAssetList } from 'pages/DashBoard/AssetsOverlay';

const SelectGroupMembersToTransferPage = () => {
  const currentChannelId = useCurrentChannelId();
  const { groupInfo } = useGroupChannelInfo(currentChannelId || '', false);
  const { members = [] } = groupInfo || {};
  const [rawMemberList, setRawMemberList] = useState<ChannelMemberInfo[]>([]);

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 200);
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

  const onPressItem = useCallback((id: string) => {
    // todo: change item
    console.log('id', id);
    showAssetList({
      isFixedToContact: true,
      toAddress: 'xxxx',
      name: 'yyy',
      chainIds: ['AELF'],
    });
  }, []);

  useEffectOnce(() => {
    setRawMemberList([...members]);
  });

  return (
    <PageContainer
      titleDom="Select Group Members"
      safeAreaColor={['blue', 'white']}
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
            selected={false}
            onPress={onPressItem}
          />
        )}
      />
    </PageContainer>
  );
};

export default SelectGroupMembersToTransferPage;

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
