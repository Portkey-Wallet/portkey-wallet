import { useCallback, useMemo, useState } from 'react';
import { Form, message } from 'antd';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import EditContactPrompt from './Prompt';
import EditContactPopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import { useCommonState } from 'store/Provider/hooks';
import { useGoProfile, useProfileCopy } from 'hooks/useProfile';
import { IEditContactFormProps } from '../components/EditContactForm';
import { ValidData } from '../AddContact';
import CustomModal from 'pages/components/CustomModal';
import { useEditIMContact } from '@portkey-wallet/hooks/hooks-ca/im';
import { handleErrorMessage } from '@portkey-wallet/utils';

export type IEditContactProps = IEditContactFormProps & BaseHeaderProps;

export default function EditContact() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { state } = useLocation();
  const transState = useMemo(() => {
    return {
      ...state,
      remark: state?.name,
      walletName: state?.caHolderInfo?.walletName || state?.imInfo?.name,
    };
  }, [state]);

  const { isNotLessThan768 } = useCommonState();
  const appDispatch = useAppDispatch();
  const [cantSave, setCantSave] = useState<boolean>(false);
  const [validName] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const [validRemark, setValidRemark] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const editContactApi = useEditIMContact();
  const { setLoading } = useLoading();

  const handleFormValueChange = useCallback(() => {
    const { name } = form.getFieldsValue();
    setCantSave(name);
  }, [form]);

  const handleInputRemarkChange = useCallback(
    (v: string) => {
      setValidRemark({ validateStatus: '', errorMsg: '' });
      if (!v) {
        setCantSave(false);
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

        const contactDetail = await editContactApi(
          {
            name: remark.trim(),
            id: state.id,
            relationId: state?.imInfo?.relationId,
          },
          state?.caHolderInfo?.walletName,
        );

        appDispatch(fetchContactListAsync());

        if (!state?.imInfo?.relationId && contactDetail?.imInfo?.relationId) {
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
            onOk: () => handleView({ ...state, ...contactDetail }),
            okText: 'Ok',
          });
        } else {
          // CANT CHAT
          handleView({ ...state, ...contactDetail });
          message.success('Edit Contact Successful');
        }
      } catch (e: any) {
        console.log('onFinish==contact error', e);
        handleErrorMessage(e, 'handle contact error');
      } finally {
        setLoading(false);
      }
    },
    [appDispatch, editContactApi, handleView, setLoading, state],
  );

  const handleCopy = useProfileCopy();

  const headerTitle = useMemo(() => t('Edit Contact'), [t]);

  return isNotLessThan768 ? (
    <EditContactPrompt
      headerTitle={headerTitle}
      goBack={() => handleView(state)}
      form={form}
      validName={validName}
      validRemark={validRemark}
      state={transState}
      isShowRemark={state.isShowRemark}
      cantSave={cantSave}
      onFinish={onFinish}
      handleInputRemarkChange={handleInputRemarkChange}
      handleCopy={handleCopy}
    />
  ) : (
    <EditContactPopup
      headerTitle={headerTitle}
      goBack={() => handleView(state)}
      form={form}
      validName={validName}
      validRemark={validRemark}
      state={transState}
      isShowRemark={state.isShowRemark}
      cantSave={cantSave}
      onFinish={onFinish}
      handleInputRemarkChange={handleInputRemarkChange}
      handleCopy={handleCopy}
    />
  );
}
