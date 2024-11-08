import React from 'react';
//  { useCallback, useEffect, useMemo, useState }

// import { View } from 'react-native';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import ContactsList from 'components/ContactList';
// import CommonTopTab from 'components/CommonTopTab';
// import { BGStyles } from 'assets/theme/styles';
// import CommonInput from 'components/CommonInput';
// import { useContactList, useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contact';
// import useDebounce from 'hooks/useDebounce';
// import SearchContactListSection from '../SearchContactListSection';
import GStyles from 'assets/theme/GStyles';
// import FindMoreButton from 'pages/Chat/components/FindMoreButton';
// import ContactUpdateWarning from 'pages/My/components/ContactUpdateWarning';
// import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
// import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import Touchable from 'components/Touchable';
import { makeStyles } from '@rneui/themed';

const ContactsHome: React.FC = () => {
  const { t } = useLanguage();
  // const contactList = useContactList();
  const pageStyles = getPageStyles();
  // const searchContact = useLocalContactSearch();
  // const [keyword, setKeyword] = useState('');
  // const [filerList, setFilterList] = useState<any[]>([]);

  // const debounceKeyword = useDebounce(keyword, 500);

  // useEffect(() => {
  //   const { contactFilterList } = searchContact(debounceKeyword, ContactsTab.ALL);
  //   console.log('searchContact', contactFilterList);
  //   setFilterList(contactFilterList);
  // }, [contactList, debounceKeyword, searchContact]);

  return (
    <PageContainer
      leftCallback={() => navigationService.navigate('Tab')}
      titleDom={t('Contacts')}
      safeAreaColor={['black', 'black']}
      rightDom={
        <Touchable
          style={{ padding: pTd(16) }}
          onPress={() => {
            navigationService.navigate('NoChatContactProfileEdit');
          }}>
          <Svg icon="add4" size={pTd(24)} />
        </Touchable>
      }
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <ContactsList isSearchShow style={pageStyles.contactListStyle} />
    </PageContainer>
  );
};

export default ContactsHome;

export const getPageStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    ...GStyles.paddingArg(0),
  },
  contactListStyle: {
    backgroundColor: theme.colors.bgBase1,
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
}));
