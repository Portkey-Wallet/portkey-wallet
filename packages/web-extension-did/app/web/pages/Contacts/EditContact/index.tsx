import { useCallback, useMemo, useState } from 'react';
import { Form, message } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { useEditContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import EditContactPrompt from './Prompt';
import EditContactPopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import { useCommonState } from 'store/Provider/hooks';
import { useGoProfile, useProfileCopy } from 'hooks/useProfile';
import { IEditContactFormProps } from '../components/EditContactForm';
import { ValidData } from '../AddContact';
import CustomModal from 'pages/components/CustomModal';

export type IEditContactProps = IEditContactFormProps & BaseHeaderProps;

export default function EditContact() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const transState = useMemo(() => {
    return { ...state, remark: state?.name, walletName: state?.caHolderInfo?.walletName };
  }, [state]);

  const { isNotLessThan768 } = useCommonState();
  const appDispatch = useAppDispatch();
  const [canSave, setCanSave] = useState<boolean>(false);
  const [validName] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const [validRemark, setValidRemark] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const editContactApi = useEditContact();
  const { setLoading } = useLoading();

  const handleFormValueChange = useCallback(() => {
    const { name } = form.getFieldsValue();
    // TODO
    setCanSave(name);
  }, [form]);

  const handleInputRemarkChange = useCallback(
    (v: string) => {
      setValidRemark({ validateStatus: '', errorMsg: '' });
      if (!v) {
        setCanSave(false);
      } else {
        handleFormValueChange();
      }
    },
    [handleFormValueChange],
  );

  const handleView = useGoProfile();
  const onFinish = useCallback(
    async (values: ContactItemType & { remark: string }) => {
      const { remark } = values;

      try {
        setLoading(true);

        const contactDetail = await editContactApi({
          name: remark.trim(),
          id: state.id,
          relationId: state?.imInfo?.relationId,
        });

        appDispatch(fetchContactListAsync());

        if (contactDetail?.imInfo?.relationId) {
          // CAN CHAT
          CustomModal({
            type: 'info',
            content: (
              <div>
                <div className="modal-title">{`DID Recognition`}</div>
                <div>
                  {
                    'This is a contact you can chat with. You can click the "Chat" button on the contact details page to start a conversation.'
                  }
                </div>
              </div>
            ),
            onOk: () => handleView(contactDetail),
            okText: 'Ok',
          });
        } else {
          // CANT CHAT
          handleView(contactDetail);
          message.success('Edit Contact Successful');
        }
      } catch (e: any) {
        console.log('onFinish==contact error', e);
        message.error(t((e.error || {}).message || e.message || 'handle contact error'));
      } finally {
        setLoading(false);
      }
    },
    [appDispatch, editContactApi, handleView, setLoading, state, t],
  );

  // go back previous page
  const handleGoBack = useCallback(() => {
    if (pathname.includes('/setting/wallet')) {
      navigate('/setting/wallet/wallet-name');
    } else {
      navigate('/setting/contacts/view', { state: state });
    }
  }, [navigate, pathname, state]);

  const handleCopy = useProfileCopy();

  const headerTitle = useMemo(() => t('Edit Contact'), [t]);

  return isNotLessThan768 ? (
    <EditContactPrompt
      headerTitle={headerTitle}
      goBack={handleGoBack}
      form={form}
      validName={validName}
      validRemark={validRemark}
      state={transState}
      isShowRemark={state.isShowRemark}
      canSave={canSave}
      onFinish={onFinish}
      handleInputRemarkChange={handleInputRemarkChange}
      handleCopy={handleCopy}
    />
  ) : (
    <EditContactPopup
      headerTitle={headerTitle}
      goBack={handleGoBack}
      form={form}
      validName={validName}
      validRemark={validRemark}
      state={transState}
      isShowRemark={state.isShowRemark}
      canSave={canSave}
      onFinish={onFinish}
      handleInputRemarkChange={handleInputRemarkChange}
      handleCopy={handleCopy}
    />
  );
}
