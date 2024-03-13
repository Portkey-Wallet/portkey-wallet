import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonInput from 'components/CommonInput';
import useDebounce from 'hooks/useDebounce';
import CommonToast from 'components/CommonToast';
import GroupInfoMemberItem, { GroupInfoMemberItemType } from '../components/GroupInfoMemberItem';
import { pTd } from 'utils/unit';
import NoData from 'components/NoData';
import { useGroupChannelInfo, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import { useCurrentChannelId } from '../context/hooks';
import { BGStyles } from 'assets/theme/styles';
import navigationService from 'utils/navigationService';
import { strIncludes } from '@portkey-wallet/utils';

const GroupMembersPage = () => {
  const { relationId: myRelationId } = useRelationId();
  const currentChannelId = useCurrentChannelId();
  const { groupInfo } = useGroupChannelInfo(currentChannelId || '', false);
  const { members = [] } = groupInfo || {};

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 200);
  const [filterMemberList, setFilterMemberList] = useState(members);

  const onPressItem = useCallback(
    (item: GroupInfoMemberItemType) => {
      if (myRelationId === item.relationId) {
        navigationService.navigate('WalletName');
      } else {
        navigationService.navigate('ChatContactProfile', {
          relationId: item.relationId,
          contact: {
            name: item?.title,
          },
        });
      }
    },
    [myRelationId],
  );

  useEffect(() => {
    try {
      setFilterMemberList(() => members.filter(ele => strIncludes(ele.name, debounceKeyword)));
    } catch (error) {
      CommonToast.failError(error);
    }
  }, [debounceKeyword, members]);

  return (
    <PageContainer
      titleDom="Members"
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
        data={filterMemberList}
        ListEmptyComponent={<NoData noPic message="No search result" style={BGStyles.bg1} />}
        keyExtractor={item => item.relationId}
        renderItem={({ item }) => (
          <GroupInfoMemberItem
            item={{
              relationId: item.relationId,
              title: item.name,
              avatar: item.avatar,
            }}
            isOwner={item.isAdmin}
            onPress={onPressItem}
            style={styles.itemStyle}
          />
        )}
      />
    </PageContainer>
  );
};

export default GroupMembersPage;

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
  itemStyle: {
    paddingHorizontal: pTd(20),
  },
  buttonWrap: {
    ...GStyles.marginArg(10, 20, 16),
  },
});
