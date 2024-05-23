import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { defaultColors } from 'assets/theme';
import ProfileHeaderSection from 'pages/My/components/ProfileHeaderSection';
import ProfileAddressSection from 'pages/My/components/ProfileAddressSection';
import { useContactInfo } from '@portkey-wallet/hooks/hooks-ca/contact';

type RouterParams = {
  contactId?: string;
};

const NoChatContactProfile: React.FC = () => {
  const { contactId } = useRouterParams<RouterParams>();
  const { t } = useLanguage();
  const contact = useContactInfo({
    contactId,
  });

  return (
    <PageContainer
      titleDom="Details"
      safeAreaColor={['white', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <ScrollView alwaysBounceVertical={true}>
        <ProfileHeaderSection showRemark={false} name={contact?.name || ''} />
        <ProfileAddressSection noMarginTop title="Address" addressList={contact?.addresses} />
      </ScrollView>
      <CommonButton
        type="primary"
        containerStyle={GStyles.paddingTop(16)}
        onPress={() => navigationService.navigate('NoChatContactProfileEdit', { contact })}>
        {t('Edit')}
      </CommonButton>
    </PageContainer>
  );
};

export default NoChatContactProfile;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(24, 20, 18),
  },
});
