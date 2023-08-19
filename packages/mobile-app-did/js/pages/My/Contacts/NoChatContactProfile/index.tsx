import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { defaultColors } from 'assets/theme';
import ProfileHeaderSection from 'pages/My/components/ProfileHeaderSection';
import ProfileAddressSection from 'pages/My/components/ProfileAddressSection';
import useEffectOnce from 'hooks/useEffectOnce';
import ActionSheet from 'components/ActionSheet';

type RouterParams = {
  contact?: ContactItemType;
};

const NoChatContactProfile: React.FC = () => {
  const { contact } = useRouterParams<RouterParams>();
  const { t } = useLanguage();

  useEffectOnce(() => {
    ActionSheet.alert({
      message:
        'Portkey has grouped contacts with the same Portkey ID together and removed duplicate contacts with the same address.',
      buttons: [
        {
          title: 'OK',
        },
      ],
    });
  });

  return (
    <PageContainer
      titleDom="Details"
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <ScrollView alwaysBounceVertical={true}>
        <ProfileHeaderSection name={contact?.name || ''} />
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
