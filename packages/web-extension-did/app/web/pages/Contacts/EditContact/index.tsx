import { useCallback, useMemo, useState } from 'react';
import { Form } from 'antd';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import EditContactPrompt from './Prompt';
import EditContactPopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import { useCommonState } from 'store/Provider/hooks';
import { IEditContactFormProps } from '../components/EditContactForm';
import { ValidData } from '../AddContact';
import CustomModal from 'pages/components/CustomModal';
import { useEditIMContact } from '@portkey-wallet/hooks/hooks-ca/im';
import { handleErrorMessage } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';
import { useLocationState } from 'hooks/router';
import { TEditContactLocationState } from 'types/router';
import { isValidRemark } from '@portkey-wallet/utils/reg';

export type IEditContactProps = IEditContactFormProps & BaseHeaderProps;

export default function EditContact() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocationState<TEditContactLocationState>();
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

  const handleView = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onFinish = useCallback(
    async (values: ContactItemType & { remark: string }) => {
      const { remark } = values;
      if (!isValidRemark(remark)) {
        setValidRemark({ validateStatus: 'error', errorMsg: 'Only a-z, A-Z, 0-9 and "_"  allowed' });
        return;
      }

      try {
        setLoading(true);

        const contactDetail = await editContactApi({
          name: remark.trim(),
          id: state.id,
          relationId: state?.imInfo?.relationId,
        });

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
            onOk: handleView,
            okText: 'Ok',
          });
        } else {
          // CANT CHAT
          handleView();
          singleMessage.success('Edit Contact Successful');
        }
      } catch (e: any) {
        console.log('onFinish==contact error', e);
        const msg = handleErrorMessage(e, 'handle contact error');
        singleMessage.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [appDispatch, editContactApi, handleView, setLoading, state],
  );

  const headerTitle = useMemo(() => t('Edit Contact'), [t]);

  return isNotLessThan768 ? (
    <EditContactPrompt
      headerTitle={headerTitle}
      goBack={handleView}
      form={form}
      validName={validName}
      validRemark={validRemark}
      state={transState}
      isShowRemark={state.isShowRemark}
      cantSave={cantSave}
      onFinish={onFinish}
      handleInputRemarkChange={handleInputRemarkChange}
    />
  ) : (
    <EditContactPopup
      headerTitle={headerTitle}
      goBack={handleView}
      form={form}
      validName={validName}
      validRemark={validRemark}
      state={transState}
      isShowRemark={state.isShowRemark}
      cantSave={cantSave}
      onFinish={onFinish}
      handleInputRemarkChange={handleInputRemarkChange}
    />
  );
}
