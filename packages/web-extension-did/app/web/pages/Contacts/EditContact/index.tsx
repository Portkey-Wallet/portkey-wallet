import { useCallback, useMemo, useState } from 'react';
import { Form, message } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import { useEditContact, useCheckContactName } from '@portkey-wallet/hooks/hooks-ca/contact';
import EditContactPrompt from './Prompt';
import EditContactPopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import { useCommonState } from 'store/Provider/hooks';
import { useGoProfile, useProfileCopy } from 'hooks/useProfile';
import { IEditContactFormProps } from '../components/EditContactForm';
import { ContactInfoError, ValidData } from '../AddContact';
import CustomModal from 'pages/components/CustomModal';

export type IEditContactProps = IEditContactFormProps & BaseHeaderProps;

export default function EditContact() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const { isNotLessThan768 } = useCommonState();
  const appDispatch = useAppDispatch();
  const [canSave, setCanSave] = useState<boolean>(false);
  const [validName, setValidName] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const [validRemark, setValidRemark] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const editContactApi = useEditContact();
  const checkExistNameApi = useCheckContactName();
  const { setLoading } = useLoading();

  const handleFormValueChange = useCallback(() => {
    const { name } = form.getFieldsValue();
    // TODO
    setCanSave(name);
  }, [form]);

  const handleInputValueChange = useCallback(
    (v: string) => {
      setValidName({ validateStatus: '', errorMsg: '' });
      if (!v) {
        setCanSave(false);
      } else {
        handleFormValueChange();
      }
    },
    [handleFormValueChange],
  );

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

  const checkExistName = useCallback(
    async (v: string) => {
      if (state.name === v) {
        return false;
      }
      const { existed } = await checkExistNameApi(v);
      return existed;
    },
    [checkExistNameApi, state.name],
  );

  const handleCheckName = useCallback(
    async (v: string) => {
      const existed = await checkExistName(v);
      if (!v) {
        form.setFieldValue('name', '');
        setCanSave(false);
        setValidName({ validateStatus: 'error', errorMsg: ContactInfoError.noName });
        return false;
      } else if (existed) {
        setCanSave(false);
        setValidName({ validateStatus: 'error', errorMsg: ContactInfoError.alreadyExists });
        return false;
      } else if (!isValidCAWalletName(v)) {
        setCanSave(false);
        setValidName({ validateStatus: 'error', errorMsg: ContactInfoError.inValidName });
        return false;
      }
      setCanSave(true);
      setValidName({ validateStatus: '', errorMsg: '' });
      return true;
    },
    [checkExistName, form],
  );

  const checkExistRemark = useCallback(
    async (v: string) => {
      if (state.remark === v) {
        return false;
      }
      const { existed } = await checkExistNameApi(v); // TODO remark
      return existed;
    },
    [checkExistNameApi, state.remark],
  );

  const handleCheckRemark = useCallback(
    async (v: string) => {
      // TODO err
      const existed = await checkExistRemark(v);

      return existed;
    },
    [checkExistRemark],
  );

  const handleView = useGoProfile();
  const onFinish = useCallback(
    async (values: ContactItemType) => {
      const { name, caHolderInfo } = values;

      try {
        setLoading(true);
        const checkName = await handleCheckName(caHolderInfo?.walletName?.trim() || '');
        const checkRemark = await handleCheckRemark(name.trim());
        if (checkName && checkRemark) {
          // TODO wallet name
          const contactDetail = await editContactApi({
            name: name.trim(),
            id: state.id,
          });

          appDispatch(fetchContactListAsync());

          if (contactDetail?.imInfo?.relationId) {
            // CAN CHAT
            CustomModal({
              type: 'confirm',
              content: 'This contact is identified as a new portkey web3 chat friend.',
              onOk: () => handleView(contactDetail),
              okText: 'Ok',
            });
          } else {
            // CANT CHAT
            handleView(contactDetail);
            message.success('Edit Contact Successful');
          }
        }
      } catch (e: any) {
        console.log('onFinish==contact error', e);
        message.error(t((e.error || {}).message || e.message || 'handle contact error'));
      } finally {
        setLoading(false);
      }
    },
    [appDispatch, editContactApi, handleCheckName, handleCheckRemark, handleView, setLoading, state.id, t],
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
      state={state}
      isNameDisable={state.isNameDisable}
      isShowRemark={state.isShowRemark}
      canSave={canSave}
      onFinish={onFinish}
      handleInputValueChange={handleInputValueChange}
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
      state={state}
      isNameDisable={state.isNameDisable}
      isShowRemark={state.isShowRemark}
      canSave={canSave}
      onFinish={onFinish}
      handleInputValueChange={handleInputValueChange}
      handleInputRemarkChange={handleInputRemarkChange}
      handleCopy={handleCopy}
    />
  );
}
