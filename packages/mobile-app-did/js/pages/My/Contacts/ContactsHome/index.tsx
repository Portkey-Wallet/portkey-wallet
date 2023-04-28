import React from 'react';
import { TouchableOpacity } from 'react-native';

import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { pageStyles } from './style';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';

import ContactsList from 'components/ContactList';

const ContactsHome: React.FC = () => {
  const { t } = useLanguage();
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
      <ContactsList />
    </PageContainer>
  );
};

export default ContactsHome;
