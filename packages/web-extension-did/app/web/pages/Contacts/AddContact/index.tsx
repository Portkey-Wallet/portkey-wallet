import { useCallback, useMemo, useEffect, useState } from 'react';
import { Form, Modal, message } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ContactItemType, AddressItem } from '@portkey-wallet/types/types-ca/contact';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import { useAddContact, useCheckContactName } from '@portkey-wallet/hooks/hooks-ca/contact';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsTestnet } from 'hooks/useNetwork';
import { IAddContactFormProps } from '../components/AddContactForm';
import AddContactPrompt from './Prompt';
import AddContactPopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import { useCommonState } from 'store/Provider/hooks';

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
export interface CustomAddressItem extends AddressItem {
  networkName: string;
  validData: ValidData;
}

export interface IAddContactProps extends IAddContactFormProps, BaseHeaderProps {
  isShowDrawer: boolean;
  closeDrawer: () => void;
  handleNetworkChange: (v: any) => void;
}

export default function AddContact() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const appDispatch = useAppDispatch();
  const [disable, setDisabled] = useState<boolean>(true);
  const [netOpen, setNetOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(-1);
  const [validName, setValidName] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const [addressArr, setAddressArr] = useState<CustomAddressItem[]>(state?.addresses);
  const [validRemark, setValidRemark] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const addContactApi = useAddContact();
  const checkExistNameApi = useCheckContactName();
  const { setLoading } = useLoading();

  const isTestNet = useIsTestnet();

  useEffect(() => {
    const { addresses } = state;
    const cusAddresses = addresses.map((ads: AddressItem) => ({
      ...ads,
      networkName: transNetworkText(ads.chainId, isTestNet),
      validData: { validateStatus: '', errorMsg: '' },
    }));
    form.setFieldValue('addresses', cusAddresses);
    setAddressArr(cusAddresses);
    setDisabled(false);
  }, [form, isTestNet, state]);

  const handleSelectNetwork = useCallback((i: number) => {
    setNetOpen(true);
    setIndex(i);
  }, []);

  const handleNetworkChange = useCallback(
    (v: any) => {
      const prevAddresses = form.getFieldValue('addresses');
      prevAddresses.splice(index, 1, {
        address: '',
        networkName: v.networkName,
        chainId: v.chainId,
        validData: { validateStatus: '', errorMsg: '' },
      });
      form.setFieldValue('addresses', [...prevAddresses]);
      const newAddresses = Object.assign(addressArr);
      newAddresses.splice(index, 1, v);
      // addressArr.splice(index, 1, v);
      setAddressArr(newAddresses);
      setNetOpen(false);
      setDisabled(true);
    },
    [addressArr, form, index],
  );

  const handleFormValueChange = useCallback(() => {
    const { name, addresses } = form.getFieldsValue();
    const flag = addresses.some((ads: Record<string, string>) => !ads?.address);
    const err = addressArr.some((ads) => ads.validData.validateStatus === 'error');
    setDisabled(!name || !addresses.length || flag || err);
  }, [addressArr, form]);

  const handleInputValueChange = useCallback(
    (v: string) => {
      setValidName({ validateStatus: '', errorMsg: '' });
      if (!v) {
        setDisabled(true);
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
        setDisabled(true);
      } else {
        handleFormValueChange();
      }
    },
    [handleFormValueChange],
  );

  const handleAddressChange = useCallback(
    (i: number, value: string) => {
      value = getAelfAddress(value.trim());
      const { addresses } = form.getFieldsValue();
      addresses[i].address = value;
      const newAddresses = Object.assign(addressArr);
      newAddresses[i].validData = { validateStatus: '', errorMsg: '' };
      setAddressArr(newAddresses);
      form.setFieldValue('addresses', [...addresses]);
      handleFormValueChange();
    },
    [addressArr, form, handleFormValueChange],
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
        setValidName({ validateStatus: 'error', errorMsg: ContactInfoError.noName });
        setDisabled(true);
        return false;
      } else if (existed) {
        setDisabled(true);
        setValidName({ validateStatus: 'error', errorMsg: ContactInfoError.alreadyExists });
        return false;
      } else if (!isValidCAWalletName(v)) {
        setDisabled(true);
        setValidName({ validateStatus: 'error', errorMsg: ContactInfoError.inValidName });
        return false;
      }
      setDisabled(false);
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
      const existed = await checkExistRemark(v);

      return existed;
    },
    [checkExistRemark],
  );

  const handleCheckAddress = useCallback(
    (addresses: AddressItem[]) => {
      let flag = 0;
      const newAddress = Object.assign(addressArr);
      addresses.forEach((ads, i) => {
        if (!isAelfAddress(ads.address)) {
          flag++;
          newAddress[i].validData = { validateStatus: 'error', errorMsg: ContactInfoError.invalidAddress };
        }
      });
      if (!flag) {
        setAddressArr(newAddress);
        setDisabled(true);
      }
      return !flag;
    },
    [addressArr],
  );

  const onFinish = useCallback(
    async (values: ContactItemType) => {
      const { name, remark, addresses } = values;

      try {
        setLoading(true);
        const checkName = await handleCheckName(name.trim());
        const checkRemark = await handleCheckRemark(remark?.trim() || '');
        const checkAddress = handleCheckAddress(addresses);
        if (checkName && checkRemark && checkAddress) {
          // TODO remark
          await addContactApi({ name: name.trim(), addresses });

          appDispatch(fetchContactListAsync());
          // navigate('/setting/contacts');
          // TODO if can chat
          Modal.confirm({
            width: 320,
            content: t('This contact is identified as a new portkey web3 chat friend.'),
            className: 'cross-modal delete-modal',
            autoFocusButton: null,
            icon: null,
            centered: true,
            okText: t('Ok'),
            cancelText: t('Cancel'),
            onOk: () => navigate('/chat'),
            onCancel: () => navigate('/setting/contacts/view', { state: {} }),
          });
          message.success('Add Contact Successful');
        }
      } catch (e: any) {
        console.log('onFinish==contact error', e);
        message.error(t((e.error || {}).message || e.message || 'handle contact error'));
      } finally {
        setLoading(false);
      }
    },
    [addContactApi, appDispatch, handleCheckAddress, handleCheckName, handleCheckRemark, navigate, setLoading, t],
  );

  // go back previous page
  const handleGoBack = useCallback(() => {
    navigate('/setting/contacts/view', { state: state });

    // navigate('/setting/contacts');
  }, [navigate, state]);

  const handleCloseDrawer = () => {
    setNetOpen(false);
  };

  const { isNotLessThan768 } = useCommonState();

  const headerTitle = useMemo(() => t('Add New Contact'), [t]);
  return isNotLessThan768 ? (
    <AddContactPrompt
      headerTitle={headerTitle}
      goBack={handleGoBack}
      form={form}
      isDisable={disable}
      validName={validName}
      validRemark={validRemark}
      state={state}
      addressArr={addressArr}
      onFinish={onFinish}
      handleSelectNetwork={handleSelectNetwork}
      handleAddressChange={handleAddressChange}
      handleInputValueChange={handleInputValueChange}
      handleInputRemarkChange={handleInputRemarkChange}
      isShowDrawer={netOpen}
      closeDrawer={handleCloseDrawer}
      handleNetworkChange={handleNetworkChange}
    />
  ) : (
    <AddContactPopup
      headerTitle={headerTitle}
      goBack={handleGoBack}
      form={form}
      isDisable={disable}
      validName={validName}
      validRemark={validRemark}
      state={state}
      addressArr={addressArr}
      onFinish={onFinish}
      handleSelectNetwork={handleSelectNetwork}
      handleAddressChange={handleAddressChange}
      handleInputValueChange={handleInputValueChange}
      handleInputRemarkChange={handleInputRemarkChange}
      isShowDrawer={netOpen}
      closeDrawer={handleCloseDrawer}
      handleNetworkChange={handleNetworkChange}
    />
  );
}
