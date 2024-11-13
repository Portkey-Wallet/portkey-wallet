import React from 'react';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import ContactsList from 'components/ContactList';
import GStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';
import { makeStyles } from '@rneui/themed';

const ContactsHome: React.FC = () => {
  const { t } = useLanguage();
  const pageStyles = getPageStyles();

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
