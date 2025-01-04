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
  invalidAddress = 'Please enter a valid address.',
  recipientAddressIsInvalid = 'Recipient address is invalid',
  alreadyExists = 'Name already in use.',
  inValidName = 'Only a-z, A-Z, 0-9, spaces and "_" allowed.',
}

const errorCodeMessageMap: Record<number, any> = {
  40021: {
    name: 'contactName',
    errorMsg: ContactInfoError.alreadyExists,
  },
  40022: {
    name: 'addressInfoInput',
    errorMsg: ContactInfoError.invalidAddress,
  },
} as const;

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

  const [form] = Form.useForm<IEditContactItemFormType & { addressInfoInput: string }>();
  const { state } = useLocationState<IContactItemType & { isFromSend?: boolean }>();
  const isFromSend = !!state?.isFromSend;
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
    form.setFieldsValue({ ...defaultContactFormData, addressInfoInput: defaultContactFormData.addressInfo.address });
  }, [defaultContactFormData, form, isMainnet, state]);

  // go back previous page
  const handleGoBack = useCallback(() => {
    isFromSend ? navigate(-2) : navigate('/setting/contacts');
  }, [isFromSend, navigate]);

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
      handleGoBack();
    } catch (err: any) {
      console.log('errrr', err);
      const errorCode: number = err?.error?.code;

      const formItemError = errorCodeMessageMap?.[errorCode];
      console.log('formItemError', err, {
        name: formItemError.name,
        errors: [formItemError.errorMsg],
      });

      if (formItemError) {
        form.setFields([
          {
            name: formItemError.name,
            errors: [formItemError.errorMsg],
          },
        ]);
      } else {
        const msg = handleErrorMessage(err, 'handle contact error');
        singleMessage.error(msg);
      }
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
