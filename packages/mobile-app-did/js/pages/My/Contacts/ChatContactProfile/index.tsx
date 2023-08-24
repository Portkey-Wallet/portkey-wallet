import React, { useCallback, useState } from 'react';
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
import ProfileHandleSection from 'pages/My/components/ProfileHandleSection';
import ProfilePortkeyIDSection from 'pages/My/components/ProfilePortkeyIDSection';
import ProfileAddressSection from 'pages/My/components/ProfileAddressSection';
import useEffectOnce from 'hooks/useEffectOnce';
import im from '@portkey-wallet/im';
import { useIsStranger } from '@portkey-wallet/hooks/hooks-ca/im';
import CommonToast from 'components/CommonToast';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { pTd } from 'utils/unit';
import { useJumpToChatDetails } from 'hooks/chat';
import { useAddStrangerContact, useReadImputation } from '@portkey-wallet/hooks/hooks-ca/contact';
import ActionSheet from 'components/ActionSheet';

type RouterParams = {
  relationId?: string; // if relationId exist, we should fetch
  contact?: ContactItemType;
};

const initEditContact: ContactItemType = {
  id: '',
  name: '',
  addresses: [],
  index: '',
  modificationTime: 0,
  isDeleted: false,
  userId: '',
  isImputation: false,
};

const ContactProfile: React.FC = () => {
  const { contact, relationId } = useRouterParams<RouterParams>();
  const { t } = useLanguage();
  const [info, setInfo] = useState(contact);
  const addStranger = useAddStrangerContact();
  const isStranger = useIsStranger(relationId || contact?.imInfo?.relationId || '');

  const navToChatDetail = useJumpToChatDetails();

  const readImputation = useReadImputation();
  useEffectOnce(() => {
    if (contact?.isImputation) {
      console.log('readImputation', contact);
      readImputation(contact);
      ActionSheet.alert({
        message:
          'Portkey has grouped contacts with the same Portkey ID together and removed duplicate contacts with the same address.',
        buttons: [
          {
            title: 'OK',
          },
        ],
      });
    }
  });

  const getProfile = useCallback(async () => {
    if (relationId) {
      try {
        const { data } = await im.service.getProfile({ relationId });
        setInfo(pre => ({ ...initEditContact, ...pre, ...(data || {}) }));
      } catch (error) {
        console.log(error);
      }
    }
  }, [relationId]);

  useEffectOnce(() => {
    getProfile();
  });

  return (
    <PageContainer
      titleDom="Details"
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}
      hideTouchable={true}>
      <ScrollView alwaysBounceVertical={true} style={pageStyles.scrollWrap}>
        <ProfileHeaderSection name={info?.name || info?.caHolderInfo?.walletName || info?.imInfo?.name || ''} />
        <ProfileHandleSection
          isAdded={!isStranger}
          onPressAdded={() => addStranger(relationId || info?.imInfo?.relationId || '')}
          onPressChat={async () => {
            try {
              navToChatDetail({ toRelationId: relationId || info?.imInfo?.relationId || '' });
            } catch (error) {
              CommonToast.fail(handleErrorMessage(error));
            }
          }}
        />
        <ProfilePortkeyIDSection portkeyID={info?.userId || ''} />
        <ProfileAddressSection addressList={info?.addresses || []} />
      </ScrollView>
      {!isStranger && (
        <CommonButton
          type="primary"
          containerStyle={pageStyles.btnWrap}
          onPress={async () => {
            navigationService.navigate('ChatContactProfileEdit', { contact: info });
          }}>
          {t('Edit')}
        </CommonButton>
      )}
    </PageContainer>
  );
};

export default ContactProfile;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(24, 0, 18),
  },
  scrollWrap: {
    paddingBottom: pTd(200),
    paddingHorizontal: pTd(20),
  },
  btnWrap: {
    paddingTop: pTd(16),
    paddingHorizontal: pTd(20),
  },
});
