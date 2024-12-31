import { useCallback, useMemo, useEffect, useState } from 'react';
import { Form } from 'antd';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { fetchContactListV2Async } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
// import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
// import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
// import { transNetworkText } from '@portkey-wallet/utils/activity';
import { IAddContactFormProps } from '../components/AddContactForm';
import AddContactPopup from './Popup';
import { BaseHeaderProps } from 'types/UI';

import { ContactHandleActionTypeEnum, ContactHandleActionType } from 'types/Profile';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import singleMessage from 'utils/singleMessage';
import { useLocationState } from 'hooks/router';
import { useContactAction, useDefaultContactFormValue, useNetworkModalShow } from './hooks';
import { IEditContactItemFormType } from './types';
import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';

export enum ContactInfoError {
  invalidAddress = 'Invalid address',
  recipientAddressIsInvalid = 'Recipient address is invalid',
  noName = 'Please enter contact name',
  alreadyExists = 'This name already exists.',
  inValidName = '3-16 characters, only a-z, A-Z, 0-9 and "_" allowed',
}

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];
export type ValidData = {
  validateStatus: ValidateStatus;
  errorMsg: string;
};
export interface CustomAddressItem {
  networkName: string;
  validData: ValidData;
}

export interface IAddContactProps extends IAddContactFormProps, BaseHeaderProps {
  deleteContact?: () => Promise<any>;
  isShowDrawer?: boolean;
}

export default function AddContact() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm<IEditContactItemFormType>();
  const { state } = useLocationState<IContactItemType>();
  const defaultContactFormData = useDefaultContactFormValue(state);
  const { extra }: { extra?: ContactHandleActionType } = useParams();
  const isEdit = useMemo(() => extra === 'edit-contact', [extra]);
  const dispatch = useAppDispatch();
  const { isNetworkModalOpen, handleNetworkModalState } = useNetworkModalShow();

  const [validName] = useState<ValidData>({
    validateStatus: '',
    errorMsg: '',
  });

  const { addContactApi, editContactApi, deleteContactApi } = useContactAction();

  const { setLoading } = useLoading();
  const isMainnet = useIsMainnet();

  // setDefault value
  useEffect(() => {
    form.setFieldsValue(defaultContactFormData);
  }, [defaultContactFormData, form, isMainnet, state]);

  // go back previous page
  const handleGoBack = useCallback(() => {
    navigate('/setting/contacts');
  }, [navigate]);

  const headerTitle = useMemo(
    () => (extra === ContactHandleActionTypeEnum.EDIT_CONTACT ? t('Edit Contact') : t('Add Address')),
    [extra, t],
  );

  const handleAddressInfoChange = useCallback(
    (v: IEditContactItemFormType['addressInfo']) => {
      console.log('handleAddressInfoChange', v);
      // TODO: change
      form.setFieldValue('addressInfo', v);
    },
    [form],
  );

  const onFinish = useCallback(async () => {
    const { addressInfo, contactName } = form.getFieldsValue();
    if (!form.validateFields()) return;

    try {
      setLoading(true);
      const params = { name: contactName, ...addressInfo };
      const action = isEdit ? editContactApi : addContactApi;
      const tips = isEdit ? 'Edit Contact Successful' : 'Add Contact Successful';
      await action(params);
      dispatch(fetchContactListV2Async());
      singleMessage.success(tips);
    } catch (e: any) {
      // TODO: Add Message Check
      console.log('onFinish==contact error', e);
      const msg = handleErrorMessage(e, 'handle contact error');
      singleMessage.error(msg);
    } finally {
      setLoading(false);
    }
  }, [addContactApi, dispatch, editContactApi, form, isEdit, setLoading]);

  const deleteContact = useCallback(async () => {
    try {
      setLoading(true);
      await deleteContactApi(state);
      singleMessage.success(t('Delete Finish'));
      setTimeout(() => {
        navigate('/setting/contacts');
      }, 1000);
    } catch (error) {
      console.log('error');
      singleMessage.error(handleErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [deleteContactApi, navigate, setLoading, state, t]);

  return (
    <AddContactPopup
      headerTitle={headerTitle}
      goBack={handleGoBack}
      form={form}
      validName={validName}
      extra={(extra ?? ContactHandleActionTypeEnum.ADD_CONTACT) as ContactHandleActionTypeEnum}
      onFinish={onFinish}
      deleteContact={deleteContact}
      handleAddressInfoChange={handleAddressInfoChange}
      isNetworkModalOpen={isNetworkModalOpen}
      handleNetworkModalState={handleNetworkModalState}
    />
  );
}
