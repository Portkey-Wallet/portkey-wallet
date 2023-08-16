import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
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
import { useContactList } from '@portkey-wallet/hooks/hooks-ca/contact';
import useDebounce from 'hooks/useDebounce';
import SearchContactListSection from '../SearchContactListSection';
import { StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import FindMoreButton from 'pages/Chat/components/FindMoreButton';

const ContactsHome: React.FC = () => {
  const { t } = useLanguage();
  const contactList = useContactList();
  const [keyword, setKeyword] = useState('');
  const [filerList, setFilterList] = useState<any[]>([]);

  const debounceKeyword = useDebounce(keyword, 500);

  const tabList = useMemo(
    () => [
      { name: 'All', tabItemDom: <ContactsList isSearchShow={false} style={pageStyles.contactListStyle} /> },
      {
        name: 'Portkey Chat',
        tabItemDom: (
          <>
            <FindMoreButton />
            <ContactsList isSearchShow={false} style={pageStyles.contactListStyle} />
          </>
        ),
      },
    ],
    [],
  );

  useEffect(() => {
    setFilterList(debounceKeyword ? contactList : []);
  }, [contactList, debounceKeyword]);

  return (
    <PageContainer
      titleDom={t('Contacts')}
      safeAreaColor={['blue', 'white']}
      rightDom={
        <TouchableOpacity
          style={{ padding: pTd(16) }}
          onPress={() => {
            navigationService.navigate('ContactEdit');
          }}>
          <Svg icon="add1" size={pTd(20)} color={defaultColors.font2} />
        </TouchableOpacity>
      }
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={[BGStyles.bg5, GStyles.paddingArg(8, 20, 8)]}>
        <CommonInput
          value={keyword}
          placeholder={t('Name or address')}
          onChangeText={value => setKeyword(value.trim())}
        />
      </View>
      {debounceKeyword ? <SearchContactListSection list={filerList} /> : <CommonTopTab tabList={tabList} />}
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
});
