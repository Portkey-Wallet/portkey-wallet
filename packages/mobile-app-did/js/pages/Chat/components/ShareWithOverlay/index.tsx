import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard, StyleSheet, View, FlatList } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import { ModalBody } from 'components/ModalBody';
import CommonInput from 'components/CommonInput';
import GroupMemberItem, { GroupMemberItemType } from '../GroupMemberItem';
import NoData from 'components/NoData';
import { useCurrentChannelId } from 'pages/Chat/context/hooks';
import { useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contact';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
import CommonToast from 'components/CommonToast';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { pTd } from 'utils/unit';
import myEvents from 'utils/deviceEvent';

function ShareWith() {
  const [keyword, setKeyword] = useState('');

  const currentChannelId = useCurrentChannelId();

  const searchContactList = useLocalContactSearch();
  const [filterMemberList, setFilterMemberList] = useState<ContactItemType[]>([]);
  const [selectedMemberMap, setSelectedMemberMap] = useState<Map<string, GroupMemberItemType>>(new Map());

  const onPressItem = useCallback((id: string, item?: GroupMemberItemType) => {
    if (!item) return;
    setSelectedMemberMap(pre => {
      if (pre.has(id)) {
        const newMap = new Map(pre);
        newMap.delete(id);
        return newMap;
      } else {
        const newMap = new Map(pre);
        newMap.set(id, item);
        return newMap;
      }
    });
  }, []);

  const onPressShare = useCallback(() => {
    // TODO: share it and nav
    console.log('onPressShare', currentChannelId, Array.from(selectedMemberMap.keys()));
  }, [currentChannelId, selectedMemberMap]);

  useEffect(() => {
    try {
      const { contactFilterList = [] } = searchContactList(keyword, ContactsTab.Chats);
      setFilterMemberList(contactFilterList);
      console.log('contactFilterList', contactFilterList);
    } catch (error) {
      CommonToast.failError(error);
    }
  }, [keyword, searchContactList]);

  return (
    <ModalBody
      modalBodyType="bottom"
      title={'Share with'}
      bottomButtonGroup={[{ title: 'send', type: 'primary', onPress: onPressShare }]}>
      <View style={styles.inputWrap}>
        <CommonInput placeholder="Search Contacts" type="search" value={keyword} onChangeText={setKeyword} />
      </View>
      <FlatList
        contentContainerStyle={styles.listWrap}
        data={filterMemberList}
        keyExtractor={(item: ContactItemType) => item.imInfo?.relationId || ''}
        ListEmptyComponent={keyword ? <NoData noPic message="No search found" /> : <NoData noPic message="No Member" />}
        onLayout={e => myEvents.nestScrollViewLayout.emit(e.nativeEvent.layout)}
        renderItem={({ item }) => (
          <GroupMemberItem
            key={item.id}
            innerWrapStyle={styles.groupMemberItemInnerWrap}
            selected={!!selectedMemberMap.has(item.imInfo?.relationId || '')}
            item={{
              title: item.name || item.caHolderInfo?.walletName || item.imInfo?.name || '',
              relationId: item.imInfo?.relationId || '',
            }}
            onPress={onPressItem}
          />
        )}
      />
    </ModalBody>
  );
}

export const ShowShareWithOverlay = () => {
  Keyboard.dismiss();
  OverlayModal.show(<ShareWith />, {
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
  },
  listWrap: {
    paddingHorizontal: pTd(20),
    paddingBottom: pTd(100),
  },
  groupMemberItemInnerWrap: {
    paddingHorizontal: 0,
  },
});
