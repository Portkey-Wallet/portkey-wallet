import React, { useCallback } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import ContactItem from 'components/ContactItem';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import navigationService from 'utils/navigationService';

type SearchContactListSectionType = {
  list: ContactItemType[];
};

const SearchContactListSection: React.FC<SearchContactListSectionType> = (props: SearchContactListSectionType) => {
  const { list } = props;

  const renderItem = useCallback(({ item }: { item: ContactItemType }) => {
    return (
      <ContactItem
        isShowChat={!!item?.imInfo?.relationId}
        contact={item}
        onPress={() => navigationService.navigate('ChatContactProfile')}
        onPressChat={() => navigationService.navigate('ChatDetails')}
      />
    );
  }, []);

  return <FlatList data={list} renderItem={renderItem} />;
};

export default SearchContactListSection;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
    ...GStyles.paddingArg(0),
  },
});
