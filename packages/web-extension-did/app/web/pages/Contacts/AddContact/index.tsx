import { useCallback, useMemo, useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ContactItemType, AddressItem } from '@portkey-wallet/types/types-ca/contact';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import { useAddContact, useCheckContactName, useEditContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsTestnet } from 'hooks/useNetwork';
import { IAddContactFormProps } from '../components/AddContactForm';
import AddContactPrompt from './Prompt';
import AddContactPopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import { useCommonState } from 'store/Provider/hooks';
import CustomModal from 'pages/components/CustomModal';
import { useGoProfile } from 'hooks/useProfile';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';

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
  const { extra } = useParams();
  const appDispatch = useAppDispatch();
  const showChat = useIsChatShow();
  const [disable, setDisabled] = useState<boolean>(true);
  const [netOpen, setNetOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(-1);
  const [validName, setValidName] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const [addressArr, setAddressArr] = useState<CustomAddressItem[]>(state?.addresses);
  const addContactApi = useAddContact();
  const editContactApi = useEditContact();
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
        chainName: v.chainName,
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

  const handleView = useGoProfile();
  const requestAddContact = useCallback(
    async (name: string, addresses: AddressItem[]) => {
      let contactDetail = {} as ContactItemType;
      if (extra === '2') {
        // edit
        contactDetail = await editContactApi({ name: name.trim(), addresses });
      } else {
        // add extra === '3'
        contactDetail = await addContactApi({ name: name.trim(), addresses });
      }

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
        message.success('Add Contact Successful');
      }
    },
    [addContactApi, appDispatch, handleView],
  );

  const onFinish = useCallback(
    async (values: ContactItemType) => {
      const { name, addresses } = values;

      try {
        setLoading(true);

        if (showChat) {
          const checkAddress = handleCheckAddress(addresses);
          if (checkAddress) {
            await requestAddContact(name, addresses);
          }
        } else {
          const checkName = await handleCheckName(name.trim());
          const checkAddress = handleCheckAddress(addresses);
          if (checkName && checkAddress) {
            await requestAddContact(name, addresses);
          }
        }
      } catch (e: any) {
        console.log('onFinish==contact error', e);
        message.error(t((e.error || {}).message || e.message || 'handle contact error'));
      } finally {
        setLoading(false);
      }
    },
    [handleCheckAddress, handleCheckName, showChat, requestAddContact, setLoading, t],
  );

  // go back previous page
  const handleGoBack = useCallback(() => {
    if (extra === '3') {
      navigate('/setting/contacts');
    } else {
      navigate('/setting/contacts/view', { state: state });
    }
  }, [extra, navigate, state]);

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
      state={state}
      addressArr={addressArr}
      onFinish={onFinish}
      handleSelectNetwork={handleSelectNetwork}
      handleAddressChange={handleAddressChange}
      handleInputValueChange={handleInputValueChange}
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
      state={state}
      addressArr={addressArr}
      onFinish={onFinish}
      handleSelectNetwork={handleSelectNetwork}
      handleAddressChange={handleAddressChange}
      handleInputValueChange={handleInputValueChange}
      isShowDrawer={netOpen}
      closeDrawer={handleCloseDrawer}
      handleNetworkChange={handleNetworkChange}
    />
  );
}
