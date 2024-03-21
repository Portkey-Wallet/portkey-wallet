import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard, StyleSheet, View, FlatList } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import { ModalBody } from 'components/ModalBody';
import CommonInput from 'components/CommonInput';
import GroupMemberItem, { GroupMemberItemType } from '../GroupMemberItem';
import NoData from 'components/NoData';
import { useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contact';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { pTd } from 'utils/unit';
import myEvents from 'utils/deviceEvent';
import navigationService from 'utils/navigationService';
import Loading from 'components/Loading';
import { useSendChannelMessage } from '@portkey-wallet/hooks/hooks-ca/im';
import { useSelectedItemsMap } from '@portkey-wallet/hooks/hooks-ca/chat';

function ShareWith(props: { linkContent: string }) {
  const { linkContent } = props;
  const [keyword, setKeyword] = useState('');

  const { sendMassMessage } = useSendChannelMessage();

  const searchContactList = useLocalContactSearch();
  const [filterMemberList, setFilterMemberList] = useState<ContactItemType[]>([]);

  const { selectedItemsMap: selectedMemberMap, onPressItem } = useSelectedItemsMap<GroupMemberItemType>();

  const onPressShare = useCallback(async () => {
    try {
      Loading.show();
      const toRelationIds = Array.from(selectedMemberMap.keys());
      await sendMassMessage({ toRelationIds, content: linkContent || '' });

      OverlayModal.hide();
      navigationService.navigate('Tab');
    } catch (error) {
      console.log('share group to contacts error', error);
    } finally {
      Loading.hide();
    }
  }, [linkContent, selectedMemberMap, sendMassMessage]);

  useEffect(() => {
    try {
      const { contactFilterList = [] } = searchContactList(keyword, ContactsTab.Chats);
      setFilterMemberList(contactFilterList);
      console.log('contactFilterList', contactFilterList);
    } catch (error) {
      console.log(error);
    }
  }, [keyword, searchContactList]);
  console.log('item!!', filterMemberList);

  return (
    <ModalBody
      modalBodyType="bottom"
      title={'Share with'}
      bottomButtonGroup={[
        {
          title: 'Send',
          disabled: selectedMemberMap.size === 0,
          type: 'primary',
          onPress: onPressShare,
        },
      ]}>
      <View style={styles.inputWrap}>
        <CommonInput
          allowClear
          placeholder="Name/address/Portkey ID"
          type="search"
          value={keyword}
          onChangeText={setKeyword}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.listWrap}
        data={filterMemberList}
        keyExtractor={(item: ContactItemType) => item.imInfo?.relationId || ''}
        ListEmptyComponent={<NoData noPic message={keyword ? 'No contact found' : 'No Member'} />}
        onLayout={e => myEvents.nestScrollViewLayout.emit(e.nativeEvent.layout)}
        renderItem={({ item }) => (
          <GroupMemberItem
            key={item.id}
            innerWrapStyle={styles.groupMemberItemInnerWrap}
            selected={!!selectedMemberMap.has(item.imInfo?.relationId || '')}
            item={{
              title: item.name || item.caHolderInfo?.walletName || item.imInfo?.name || '',
              relationId: item.imInfo?.relationId || '',
              avatar: item.avatar || '',
            }}
            onPress={onPressItem}
          />
        )}
      />
    </ModalBody>
  );
}

export const ShowShareWithOverlay = (props: { linkContent: string }) => {
  Keyboard.dismiss();
  OverlayModal.show(<ShareWith {...props} />, {
    position: 'bottom',
  });
};

export default {
  ShowShareWithOverlay,
};

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  inputWrap: {
    paddingHorizontal: pTd(20),
    paddingBottom: pTd(8),
  },
  listWrap: {
    paddingHorizontal: pTd(20),
    paddingBottom: pTd(100),
  },
  groupMemberItemInnerWrap: {
    paddingHorizontal: 0,
  },
});
