import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
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
import ContactAddress from '../ContactEdit/components/ContactAddress';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import ChainOverlay from 'components/ChainOverlay';
import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CommonToast from 'components/CommonToast';
import ActionSheet from 'components/ActionSheet';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useAddContact, useContact, useDeleteContact, useEditContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import Loading from 'components/Loading';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
// import myEvents from 'utils/deviceEvent';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { defaultColors } from 'assets/theme';
import myEvents from 'utils/deviceEvent';
import { useInputFocus } from 'hooks/useInputFocus';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';

type RouterParams = {
  contact?: ContactItemType;
  addressList?: Array<AddressItem>; // if addressList, it is from send page
};

export type EditAddressType = AddressItem & { error: ErrorType };
interface EditContactType extends EditContactItemApiType {
  error: ErrorType;
  addresses: EditAddressType[];
}

type CustomChainItemType = IChainItemType & {
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
  const isEdit = useMemo(() => contact !== undefined, [contact]);

  const iptRef = useRef<TextInput>();
  useInputFocus(iptRef, !isEdit);

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
      const result = await (isEdit ? editContactApi(editContact) : addContactApi(editContact));
      CommonToast.success(t(isEdit ? 'Saved Successful' : 'Contact Added'));

      if (result.imInfo?.relationId) {
        return ActionSheet.alert({
          title: 'DID Recognition',
          message:
            'This is a contact you can chat with. You can click the "Chat" button on the contact details page to start a conversation.',
          buttons: [
            {
              title: 'OK',
              type: 'primary',
              onPress: () => {
                myEvents.refreshMyContactDetailInfo.emit({
                  contactName: editContact.name,
                  contactAvatar: result.avatar,
                });
                navigationService.navigate('ChatContactProfile', {
                  contact: result,
                  relationId: result.imInfo?.relationId,
                  isFromNoChatProfileEditPage: true,
                });
              },
            },
          ],
        });
      }

      if (addressList && addressList?.length > 0) {
        // from send page
        if (
          editContact.addresses[0].address === addressList?.[0]?.address &&
          editContact.addresses[0].chainId === addressList?.[0]?.chainId
        ) {
          myEvents.refreshMyContactDetailInfo.emit({ contactName: editContact.name, contactAvatar: result.avatar });
        }
        navigationService.goBack();
      } else {
        navigationService.navigate('ContactsHome');
      }
    } catch (err: any) {
      CommonToast.failError(err);
    } finally {
      Loading.hide();
    }
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
        type="general"
        theme="white-bg"
        maxLength={16}
        ref={iptRef}
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
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      <View style={pageStyles.btnContainer}>
        <CommonButton onPress={onFinish} disabled={isSaveDisable} type="primary">
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

const { error1, bg4, font5, font4 } = defaultColors;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: bg4,
    ...GStyles.paddingArg(24, 16, 20),
  },
  addAddressBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: pTd(110),
  },
  nameInputStyle: {
    color: font5,
    fontSize: pTd(14),
  },
  nameLabelStyle: {
    marginLeft: pTd(4),
  },
  deleteTitle: {
    color: error1,
  },
  addAddressText: {
    color: font4,
    marginLeft: pTd(8),
  },
  btnContainer: {
    paddingTop: pTd(16),
  },
  deleteBtnStyle: {
    marginTop: pTd(8),
  },
});
