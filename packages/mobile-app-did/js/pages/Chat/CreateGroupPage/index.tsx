import React, { useCallback, useState, memo, useEffect, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';

import CommonInput from 'components/CommonInput';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import CommonAvatar from 'components/CommonAvatar';
import CommonButton from 'components/CommonButton';
import { useChatContactFlatList, useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contact';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
import { TextM } from 'components/CommonText';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';

type ItemProps = {
  item: ContactItemType;
  selectedContactMap: { [key: string]: string };
  onPress: (id: string) => void;
};

const Item = memo(
  function ContactItem(props: ItemProps) {
    const { item, selectedContactMap: selectedMap, onPress } = props;
    const isSelected = useMemo(() => !!selectedMap?.[item.id], [item.id, selectedMap]);

    return (
      <Touchable style={GStyles.flexRow} onPress={() => onPress?.(item.id)}>
        <Svg icon={isSelected ? 'selected' : 'unselected'} />
        <CommonAvatar hasBorder title={item.name || item.caHolderInfo?.walletName || item.imInfo?.name} />
        <TextM>{item.name || item.caHolderInfo?.walletName || item.imInfo?.name}</TextM>
      </Touchable>
    );
  },
  function isEqual(pre, next) {
    return !!pre.selectedContactMap?.[pre.item.id] === !!next.selectedContactMap?.[next.item?.id];
  },
);

const ChatGroupDetails = () => {
  const [keyword, setKeyword] = useState('');
  const allChatList = useChatContactFlatList();
  const searchContact = useLocalContactSearch();

  const [filterChatContactList, setFilterChatContactList] = useState<ContactItemType[]>([]);
  const [selectedContactMap, setSelectedContactMap] = useState<{ [key: string]: string }>({});

  const selectedCount = useMemo((): number => Object.keys(selectedContactMap).length, [selectedContactMap]);
  const totalCount = useMemo((): number => allChatList.length, [allChatList]);

  const onPressConfirm = useCallback(() => {
    try {
      Loading.show();
      console.log('selectedContactMap confirm ', selectedContactMap);
      // TODO api
      CommonToast.success('Group created');
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [selectedContactMap]);

  const onPressItem = useCallback((id: string) => {
    setSelectedContactMap(prevMap => {
      if (prevMap[id]) {
        const updatedMap = { ...prevMap };
        delete updatedMap[id];
        return updatedMap;
      } else {
        return { ...prevMap, [id]: id };
      }
    });
  }, []);

  useEffect(() => {
    if (keyword.trim()) {
      const { contactFilterList } = searchContact(keyword.trim(), ContactsTab.Chats);
      setFilterChatContactList(contactFilterList || []);
    } else {
      setFilterChatContactList(allChatList);
    }
  }, [allChatList, keyword, searchContact]);

  return (
    <PageContainer
      titleDom="Create Group"
      hideTouchable
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <CommonInput type="general" />
      <CommonInput type="search" value={keyword} onChangeText={setKeyword} />

      <TextM>{`${selectedCount}/${totalCount}`}</TextM>
      {/* TODO: change true data  */}
      <FlatList
        extraData={(item: ContactItemType) => item.id}
        data={filterChatContactList}
        renderItem={({ item }: { item: ContactItemType }) => (
          <Item item={item} selectedContactMap={selectedContactMap} onPress={onPressItem} />
        )}
      />
      <CommonButton title="confirm" onPress={onPressConfirm} />
    </PageContainer>
  );
};

export default ChatGroupDetails;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
});
