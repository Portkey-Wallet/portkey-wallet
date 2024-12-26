import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import CommonInput from 'components/CommonInput';
import navigationService from 'utils/navigationService';
import { getContactListStyles } from './style';
import ContactItem, { getStyles as getContactItemStyles } from 'components/ContactItem';
import ContactFlashList from './ContactFlashList';
import { TextL, TextM } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { ViewStyleType } from 'types/styles';
import { useContact, useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contactNew';
import { IContactIndexType, IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
interface ContactsListProps {
  isIndexBarShow?: boolean;
  isSearchShow?: boolean;
  isContactUpdateWarningShow?: boolean;
  renderContactItem?: (item: IContactItemType) => JSX.Element;
  itemHeight?: number;
  style?: ViewStyleType;
  ListFooterComponent?: JSX.Element;
  // isTransaction?: boolean;
}
type FlashItemType = IContactIndexType | IContactItemType;
const defaultList: IContactIndexType[] = [];
const ContactsList: React.FC<ContactsListProps> = ({
  isIndexBarShow = true,
  isSearchShow = true,
  renderContactItem,
  itemHeight,
  style,
  ListFooterComponent,
}) => {
  const contactListStyles = getContactListStyles();
  const contactItemStyles = getContactItemStyles();
  const { contactIndexListNew: contactIndexList = defaultList } = useContact();
  const [list, setList] = useState<IContactIndexType[]>([]);
  const localContactSearch = useLocalContactSearch();

  const flashListData = useMemo<FlashItemType[]>(() => {
    let _flashListData: FlashItemType[] = [];
    list.forEach(contactIndex => {
      if (!contactIndex.contacts.length) return;

      _flashListData.push({
        ...contactIndex,
      });
      _flashListData = _flashListData.concat(contactIndex.contacts);
    });
    return _flashListData;
  }, [list]);

  const [keyWord, setKeyWord] = useState<string>('');

  useEffect(() => {
    setList(contactIndexList ?? []);
    setKeyWord('');
  }, [contactIndexList]);

  // keyword filter;
  const onChangeKeywords = useCallback(
    (value: string) => {
      setKeyWord(value);
      const { contactIndexFilterList } = localContactSearch(value);
      setList(contactIndexFilterList);
    },
    [localContactSearch],
  );

  const _renderSection = (contactIndex: IContactIndexType) => {
    return (
      <TextM key={contactIndex.index} style={[contactListStyles.sectionIndex]}>
        {contactIndex.index}
      </TextM>
    );
  };

  const _renderItem = (item: IContactItemType) => {
    if (renderContactItem) return renderContactItem(item);
    return (
      <ContactItem
        key={item.id}
        contact={item}
        onPress={() => {
          return navigationService.navigate('NoChatContactProfile', {
            contact: item,
          });
        }}
      />
    );
  };

  const isExistContact = useMemo<boolean>(() => list.reduce((pv, cv) => pv + cv.contacts.length, 0) > 0, [list]);

  const indexList = useMemo(() => {
    return contactIndexList.filter(item => item.contacts.length);
  }, [contactIndexList]);

  return (
    <View style={[contactListStyles.listWrap, style]}>
      {isSearchShow && (
        <View style={[contactListStyles.bg, GStyles.paddingArg(10, 16, 8, 16)]}>
          <CommonInput
            theme="black-bg"
            value={keyWord}
            placeholder={'Name, address'}
            onChangeText={value => {
              onChangeKeywords(value);
            }}
          />
        </View>
      )}
      {isExistContact && (
        <ContactFlashList
          dataArray={flashListData}
          contactIndexList={indexList}
          sectionHeight={contactListStyles.sectionIndex.height}
          itemHeight={itemHeight || contactItemStyles.itemWrap.height}
          renderContactIndex={_renderSection}
          renderContactItem={_renderItem}
          isIndexBarShow={isIndexBarShow && !keyWord}
          ListFooterComponent={ListFooterComponent}
        />
      )}

      {!isExistContact && <TextL style={[contactListStyles.noResult]}>No saved address</TextL>}
    </View>
  );
};
export default ContactsList;
