import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import NoData from 'components/NoData';
import CommonInput from 'components/CommonInput';
import { BGStyles } from 'assets/theme/styles';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { useChatContactFlatList, useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contact';
import useDebounce from 'hooks/useDebounce';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import ContactItem from 'components/ContactItem';
import { useJumpToChatDetails } from 'hooks/chat';

const NewChatHome = () => {
  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 500);
  const allChatList = useChatContactFlatList();
  const searchContact = useLocalContactSearch();
  const [filterList, setFilterList] = useState<ContactItemType[]>(allChatList);
  const jumpToDetail = useJumpToChatDetails();

  useEffect(() => {
    if (!debounceKeyword) return setFilterList(allChatList);

    const { contactFilterList } = searchContact(debounceKeyword, ContactsTab.Chats);
    setFilterList(contactFilterList);
  }, [allChatList, debounceKeyword, searchContact]);

  const renderItem = useCallback(
    ({ item }: { item: ContactItemType }) => {
      return (
        <ContactItem
          isShowChat
          contact={item}
          onPress={() => {
            navigationService.navigate('ChatContactProfile', { contactId: item.id });
          }}
          onPressChat={() => {
            jumpToDetail({ toRelationId: item.imInfo?.relationId || '' });
          }}
        />
      );
    },
    [jumpToDetail],
  );

  return (
    <PageContainer
      safeAreaColor={['white', 'gray']}
      scrollViewProps={{ disabled: true }}
      hideTouchable={true}
      containerStyles={styles.containerStyles}
      titleDom="New Chat">
      <View style={[BGStyles.bg1, GStyles.paddingArg(0, 20, 8)]}>
        <CommonInput grayBorder theme="white-bg" value={keyword} placeholder="Name/address" onChangeText={setKeyword} />
      </View>
      <FlatList
        data={filterList}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <NoData noPic message={debounceKeyword && filterList.length === 0 ? 'No contact found' : 'No contact'} />
        }
        renderItem={renderItem}
      />
    </PageContainer>
  );
};

export default NewChatHome;

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg1,
    paddingHorizontal: 0,
    flex: 1,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  svgWrap: {
    padding: pTd(16),
  },
  itemWrap: {
    width: screenWidth,
    height: pTd(72),
  },
  avatarStyle: {
    marginHorizontal: pTd(20),
    marginVertical: pTd(18),
  },
  rightSection: {
    height: pTd(72),
    flex: 1,
    borderBottomColor: defaultColors.border1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingRight: pTd(20),
  },
  chatButton: {
    backgroundColor: defaultColors.bg5,
    borderRadius: pTd(6),
    overflow: 'hidden',
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(4),
  },
});
