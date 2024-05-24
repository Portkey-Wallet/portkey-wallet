import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import ContactsList from 'components/ContactList';
import CommonTopTab from 'components/CommonTopTab';
import { BGStyles } from 'assets/theme/styles';
import CommonInput from 'components/CommonInput';
import { useContactList, useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contact';
import useDebounce from 'hooks/useDebounce';
import SearchContactListSection from '../SearchContactListSection';
import { StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import FindMoreButton from 'pages/Chat/components/FindMoreButton';
import ContactUpdateWarning from 'pages/My/components/ContactUpdateWarning';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import Touchable from 'components/Touchable';

const ContactsHome: React.FC = () => {
  const { t } = useLanguage();
  const contactList = useContactList();
  const searchContact = useLocalContactSearch();
  const [keyword, setKeyword] = useState('');
  const [filerList, setFilterList] = useState<any[]>([]);

  const debounceKeyword = useDebounce(keyword, 500);
  const isShowChat = useIsChatShow();

  const tabList = useMemo(
    () => [
      { name: 'All', tabItemDom: <ContactsList isSearchShow={false} style={pageStyles.contactListStyle} /> },
      {
        name: 'Chats',
        tabItemDom: (
          <>
            <FindMoreButton />
            <ContactsList justChatContact isSearchShow={false} style={pageStyles.contactListStyle} />
          </>
        ),
      },
    ],
    [],
  );

  const clearText = useCallback(() => setKeyword(''), []);

  useEffect(() => {
    const { contactFilterList } = searchContact(debounceKeyword, ContactsTab.ALL);
    console.log('searchContact', contactFilterList);
    setFilterList(contactFilterList);
  }, [contactList, debounceKeyword, searchContact]);

  return (
    <PageContainer
      leftCallback={() => navigationService.navigate('Tab')}
      titleDom={t('Contacts')}
      safeAreaColor={['white', 'white']}
      rightDom={
        <Touchable
          style={{ padding: pTd(16) }}
          onPress={() => {
            navigationService.navigate('NoChatContactProfileEdit');
          }}>
          <Svg icon="add1" size={pTd(20)} color={defaultColors.icon5} />
        </Touchable>
      }
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      {isShowChat && (
        <>
          <View style={[BGStyles.bg1, GStyles.paddingArg(0, 20, 8)]}>
            <CommonInput
              grayBorder
              theme="white-bg"
              value={keyword}
              placeholder={t('Name/address')}
              onChangeText={value => setKeyword(value.trim())}
              rightIcon={
                keyword ? (
                  <Touchable onPress={clearText}>
                    <Svg icon="clear3" size={pTd(16)} />
                  </Touchable>
                ) : undefined
              }
              rightIconContainerStyle={pageStyles.rightIconContainerStyle}
            />
          </View>
          <ContactUpdateWarning />
          {debounceKeyword ? <SearchContactListSection list={filerList} /> : <CommonTopTab tabList={tabList} />}
        </>
      )}
      {!isShowChat && <ContactsList isSearchShow isContactUpdateWarningShow style={pageStyles.contactListStyle} />}
    </PageContainer>
  );
};

export default ContactsHome;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
    ...GStyles.paddingArg(0),
  },
  contactListStyle: {
    backgroundColor: defaultColors.bg1,
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
});
