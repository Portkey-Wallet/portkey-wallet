import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { pageStyles } from './style';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { AddressItem, ContactItemType, EditContactItemApiType } from '@portkey-wallet/types/types-ca/contact';
import Input from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import { INIT_HAS_ERROR, INIT_NONE_ERROR, ErrorType } from '@portkey-wallet/constants/constants-ca/common';
import ContactAddress from './components/ContactAddress';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import ChainOverlay from 'components/ChainOverlay';
import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CommonToast from 'components/CommonToast';
import ActionSheet from 'components/ActionSheet';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useAddContact, useContact, useDeleteContact, useEditContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import Loading from 'components/Loading';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import myEvents from 'utils/deviceEvent';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';

type RouterParams = {
  contact?: ContactItemType;
  addressList?: Array<AddressItem>;
};

export type EditAddressType = AddressItem & { error: ErrorType };
interface EditContactType extends EditContactItemApiType {
  error: ErrorType;
  addresses: EditAddressType[];
}

type CustomChainItemType = ChainItemType & {
  customChainName: string;
};

const initEditContact: EditContactType = {
  id: '',
  name: '',
  error: { ...INIT_HAS_ERROR },
  addresses: [],
};

const ContactEdit: React.FC = () => {
  const { contact, addressList } = useRouterParams<RouterParams>();
  const defaultToken = useDefaultToken();
  const { t } = useLanguage();
  const addContactApi = useAddContact();
  const editContactApi = useEditContact();
  const deleteContactApi = useDeleteContact();

  const { contactIndexList } = useContact();
  const [editContact, setEditContact] = useState<EditContactType>(initEditContact);
  const currentNetworkInfo = useCurrentNetworkInfo();

  useEffect(() => {
    if (!contact) return;
    const _contact: ContactItemType = JSON.parse(JSON.stringify(contact));
    setEditContact({
      ..._contact,
      error: { ...INIT_NONE_ERROR },
      addresses: _contact.addresses.map(item => ({
        ...item,
        error: { ...INIT_NONE_ERROR },
      })),
    });
  }, [contact]);
  const isEdit = useMemo(() => contact !== undefined, [contact]);

  const { chainList = [], currentNetwork } = useCurrentWallet();
  const customChainList = useMemo<CustomChainItemType[]>(
    () =>
      chainList.map(chain => ({
        ...chain,
        customChainName: formatChainInfoToShow(chain.chainId, currentNetworkInfo.networkType),
      })),
    [chainList, currentNetworkInfo.networkType],
  );
  const chainMap = useMemo(() => {
    const _chainMap: { [k: string]: CustomChainItemType } = {};
    customChainList.forEach(item => {
      _chainMap[item.chainId] = item;
    });
    return _chainMap;
  }, [customChainList]);

  useEffect(() => {
    if (isEdit || chainList.length === 0) return;
    setEditContact(preEditContact => {
      const _editContact = { ...preEditContact };
      if (!addressList) {
        _editContact.addresses = [
          {
            chainName: 'aelf',
            chainId: chainList[0].chainId,
            address: '',
            error: { ...INIT_HAS_ERROR },
          },
        ];
      } else {
        _editContact.addresses = [];
        addressList.forEach(item => {
          _editContact.addresses.push({
            chainName: 'aelf',
            chainId: chainMap[item.chainId]?.chainId || chainList[0].chainId,
            address: item.address,
            error: { ...INIT_HAS_ERROR },
          });
        });
      }
      return _editContact;
    });
  }, [addressList, chainList, chainMap, currentNetwork, isEdit]);

  const onNameChange = useCallback((value: string) => {
    setEditContact(preEditContact => ({
      ...preEditContact,
      name: value,
      error: { ...INIT_NONE_ERROR },
    }));
  }, []);

  // const addAddress = useCallback(() => {
  //   if (editContact.addresses.length >= ADDRESS_NUM_LIMIT) return;
  //   if (chainList.length < 1) return;
  //   setEditContact(preEditContact => ({
  //     ...preEditContact,
  //     addresses: [
  //       ...preEditContact.addresses,
  //       {
  //         id: '',
  //         chainType: currentNetwork,
  //         chainId: chainList[0].chainId,
  //         address: '',
  //         error: { ...INIT_HAS_ERROR },
  //       },
  //     ],
  //   }));
  // }, [chainList, currentNetwork, editContact.addresses.length]);

  const deleteAddress = useCallback((deleteIdx: number) => {
    setEditContact(preEditContact => ({
      ...preEditContact,
      addresses: preEditContact.addresses.filter((_, itemIdx) => itemIdx !== deleteIdx),
    }));
  }, []);

  const onAddressChange = useCallback((value: string, idx: number) => {
    value = getAelfAddress(value.trim());
    setEditContact(preEditContact => {
      const _editContact = { ...preEditContact };
      const curAddress = _editContact.addresses[idx];
      curAddress.address = value;
      curAddress.error = {
        ...INIT_NONE_ERROR,
      };
      return _editContact;
    });
  }, []);

  const isSaveDisable = useMemo(() => {
    if (editContact.name === '') return true;
    const addresses = editContact.addresses;
    if (addresses.length === 0) return true;
    for (let i = 0; i < addresses.length; i++) {
      if (addresses[i].address === '') return true;
    }
    return false;
  }, [editContact]);

  const checkError = useCallback(() => {
    const _nameValue = editContact.name.trim();

    let isErrorExist = false;
    const _editContact = { ...editContact };

    if (_nameValue === '') {
      isErrorExist = true;
      _editContact.name = _nameValue;
      _editContact.error = {
        ...INIT_HAS_ERROR,
        errorMsg: t('Please enter contact name'),
      };
    } else if (!isValidCAWalletName(_nameValue)) {
      isErrorExist = true;
      _editContact.error = {
        ...INIT_HAS_ERROR,
        errorMsg: t('Only a-z, A-Z, 0-9 and "_"  allowed'),
      };
    } else {
      let isContactNameExist = false;
      for (let i = 0; i < contactIndexList.length; i++) {
        if (isContactNameExist) break;
        const contacts = contactIndexList[i].contacts;
        for (let j = 0; j < contacts.length; j++) {
          if (contacts[j].name === _editContact.name && contacts[j].id !== _editContact.id) {
            isContactNameExist = true;
            break;
          }
        }
      }
      if (isContactNameExist) {
        isErrorExist = true;
        _editContact.error = {
          ...INIT_HAS_ERROR,
          errorMsg: t('This name already exists.'),
        };
      }
    }

    _editContact.addresses.forEach(addressItem => {
      if (!isAelfAddress(addressItem.address)) {
        isErrorExist = true;
        addressItem.error = {
          ...INIT_HAS_ERROR,
          errorMsg: t('Invalid address'),
        };
      }
    });
    if (isErrorExist) setEditContact(_editContact);
    return isErrorExist;
  }, [contactIndexList, editContact, t]);

  const onFinish = useCallback(async () => {
    const isErrorExist = checkError();
    if (isErrorExist) return;
    Loading.show();
    try {
      let result;

      if (isEdit) {
        result = await editContactApi(editContact);
        CommonToast.success(t('Saved Successful'), undefined, 'bottom');
      } else {
        result = await addContactApi(editContact);
        CommonToast.success(t('Contact Added'), undefined, 'bottom');
      }

      if (addressList && addressList?.length > 0) {
        if (
          editContact.addresses[0].address === addressList?.[0]?.address &&
          editContact.addresses[0].chainId === addressList?.[0]?.chainId
        ) {
          myEvents.refreshMyContactDetailInfo.emit({
            contactName: editContact.name,
            contactAvatar: result.avatar || '',
          });
        }
        navigationService.goBack();
      } else {
        navigationService.navigate('ContactsHome');
      }
    } catch (err: any) {
      CommonToast.failError(err);
    }
    Loading.hide();
  }, [addContactApi, addressList, checkError, editContact, editContactApi, isEdit, t]);

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
              await deleteContactApi(editContact);
              CommonToast.success(t('Contact Deleted'), undefined, 'bottom');
              navigationService.navigate('ContactsHome');
            } catch (error: any) {
              console.log('onDelete:error', error);
              CommonToast.failError(error.error);
            }
            Loading.hide();
          },
        },
      ],
    });
  }, [deleteContactApi, editContact, t]);

  const onChainChange = useCallback(
    (addressIdx: number, chainItem: CustomChainItemType) => {
      onAddressChange('', addressIdx);
      setEditContact(preEditContact => {
        const _editContact = { ...preEditContact };
        _editContact.addresses[addressIdx].chainId = chainItem.chainId;
        return _editContact;
      });
    },
    [onAddressChange],
  );

  return (
    <PageContainer
      safeAreaColor={['white', 'gray']}
      titleDom={isEdit ? t('Edit Contact') : t('Add New Contacts')}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <Input
        grayBorder
        type="general"
        theme="white-bg"
        maxLength={16}
        label={t('Name')}
        placeholder={t('Enter name')}
        inputStyle={pageStyles.nameInputStyle}
        labelStyle={pageStyles.nameLabelStyle}
        value={editContact.name}
        onChangeText={onNameChange}
        errorMessage={editContact.error.isError ? editContact.error.errorMsg : ''}
      />
      <KeyboardAwareScrollView
        extraHeight={pTd(300)}
        keyboardShouldPersistTaps="handled"
        keyboardOpeningTime={0}
        enableOnAndroid={true}>
        <TouchableWithoutFeedback>
          <View style={GStyles.paddingArg(0, 4)}>
            {editContact.addresses.map((addressItem, addressIdx) => (
              <ContactAddress
                isDeleteShow={false}
                key={addressIdx}
                editAddressItem={addressItem}
                editAddressIdx={addressIdx}
                onDelete={deleteAddress}
                chainName={chainMap[addressItem.chainId]?.customChainName || ''}
                onChainPress={() =>
                  ChainOverlay.showList({
                    list: customChainList,
                    value: addressItem.chainId,
                    labelAttrName: 'customChainName',
                    callBack: item => {
                      onChainChange(addressIdx, item);
                    },
                  })
                }
                addressValue={addressItem.address}
                affix={[defaultToken.symbol, addressItem.chainId]}
                onAddressChange={onAddressChange}
              />
            ))}

            {/* {editContact.addresses.length < 5 && (
              <View>
                <Touchable onPress={addAddress} style={pageStyles.addAddressBtn}>
                  <Svg icon="add-token" size={pTd(20)} />
                  <TextM style={pageStyles.addAddressText}>{t('Add Address')}</TextM>
                </Touchable>
              </View>
            )} */}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>

      <View style={pageStyles.btnContainer}>
        <CommonButton onPress={onFinish} disabled={isSaveDisable} type="solid">
          {isEdit ? t('Save') : t('Add')}
        </CommonButton>
        {isEdit && (
          <CommonButton
            style={pageStyles.deleteBtnStyle}
            onPress={onDelete}
            titleStyle={FontStyles.font12}
            type="clear">
            {t('Delete')}
          </CommonButton>
        )}
      </View>
    </PageContainer>
  );
};

export default ContactEdit;
