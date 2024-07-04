import React, { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import { IContactProfile } from '@portkey-wallet/types/types-ca/contact';
import CommonToast from 'components/CommonToast';
import { TextM } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { defaultColors } from 'assets/theme';
import ProfileAddressSection from 'pages/My/components/ProfileAddressSection';
import ProfileRemarkSection from 'pages/My/components/ProfileRemarkSection';
import FormItem from 'components/FormItem';
import ActionSheet from 'components/ActionSheet';
import Loading from 'components/Loading';
import { useDeleteContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import { isValidRemark } from '@portkey-wallet/utils/reg';
import { useEditIMContact } from '@portkey-wallet/hooks/hooks-ca/im';
import ProfileLoginAccountsSection from '../components/ProfileLoginAccountsSection';

type RouterParams = {
  contact?: IContactProfile;
  isFromChatProfileEditPage?: boolean;
};

const ChatContactProfileEdit: React.FC = () => {
  const { contact } = useRouterParams<RouterParams>();
  const { t } = useLanguage();

  const editContact = useEditIMContact();
  const deleteContact = useDeleteContact();

  const [remark, setRemark] = useState(contact?.name || '');
  const [error, setError] = useState('');

  const onFinish = useCallback(async () => {
    if (remark && !isValidRemark(remark)) return setError('1-16 charaers, Only a-z, A-Z, 0-9 and "_"  allowed');
    try {
      Loading.show();
      await editContact({ name: remark, id: contact?.id || '', relationId: contact?.imInfo?.relationId || '' });
      CommonToast.success(t('Saved Successful'));

      navigationService.goBack();
      Loading.hide();
    } catch (e) {
      CommonToast.failError(e);
      Loading.hide();
    }
  }, [contact, editContact, remark, t]);

  const onDelete = useCallback(() => {
    ActionSheet.alert({
      title: t('Delete Contact?'),
      message: t('After the contact is deleted, all relevant information will also be removed.'),
      buttons: [
        {
          title: t('No'),
          type: 'outline',
        },
        {
          title: t('Yes'),
          onPress: async () => {
            Loading.show();
            try {
              if (!contact) return;
              await deleteContact(contact);
              CommonToast.success(t('Contact Deleted'), undefined, 'bottom');
              navigationService.goBack();
              navigationService.goBack();
            } catch (e: any) {
              console.log('onDelete:error', e);
              CommonToast.failError(e);
            }
            Loading.hide();
          },
        },
      ],
    });
  }, [contact, deleteContact, t]);

  return (
    <PageContainer
      titleDom={'Edit Contact'}
      safeAreaColor={['white', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}
      hideTouchable={true}>
      <ScrollView alwaysBounceVertical={true} style={pageStyles.contentWrap}>
        <FormItem title={'Wallet Name'} style={GStyles.marginTop(24)}>
          <TextM numberOfLines={1} style={pageStyles.walletName}>
            {contact?.caHolderInfo?.walletName || ''}
          </TextM>
        </FormItem>
        <ProfileRemarkSection
          errorMessage={error}
          value={remark}
          onChangeText={v => {
            setError('');
            setRemark(v);
          }}
        />
        {contact?.addresses && <ProfileAddressSection disable addressList={contact?.addresses} />}
        <ProfileLoginAccountsSection disable list={contact?.loginAccounts || []} />
      </ScrollView>

      <View style={pageStyles.btnContainer}>
        <CommonButton onPress={onFinish} type="primary">
          {t('Save')}
        </CommonButton>
        <CommonButton style={pageStyles.deleteBtnStyle} onPress={onDelete} titleStyle={FontStyles.font12} type="clear">
          {t('Delete')}
        </CommonButton>
      </View>
    </PageContainer>
  );
};

export default ChatContactProfileEdit;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(0, 0, 18),
  },
  contentWrap: {
    paddingHorizontal: pTd(20),
  },
  walletName: {
    width: '100%',
    height: pTd(56),
    color: defaultColors.font5,
    backgroundColor: defaultColors.bg18,
    paddingHorizontal: pTd(16),
    lineHeight: pTd(56),
    borderRadius: pTd(6),
    overflow: 'hidden',
  },
  addAddressBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: pTd(110),
  },
  nameInputStyle: {
    color: defaultColors.font5,
    fontSize: pTd(14),
  },
  nameLabelStyle: {
    marginLeft: pTd(4),
  },
  deleteTitle: {
    color: defaultColors.error1,
  },
  addAddressText: {
    color: defaultColors.font4,
    marginLeft: pTd(8),
  },
  btnContainer: {
    paddingTop: pTd(16),
    paddingHorizontal: pTd(20),
  },
  deleteBtnStyle: {
    marginTop: pTd(8),
  },
});
