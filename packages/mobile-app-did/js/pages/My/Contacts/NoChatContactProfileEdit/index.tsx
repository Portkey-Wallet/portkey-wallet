import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, TextInput, View, Image, TouchableOpacity } from 'react-native';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import Input from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import ActionSheet from 'components/ActionSheet';
import ListItem from 'components/ListItem';
import GStyles from 'assets/theme/GStyles';
import { INIT_NONE_ERROR, ErrorType, INIT_HAS_ERROR } from '@portkey-wallet/constants/constants-ca/common';
import ChainOverlay from 'pages/My/Contacts/ContactChainOverlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAddContact, useDeleteContact, useEditContact } from '@portkey-wallet/hooks/hooks-ca/contactNew';
import { useNetworkList } from '@portkey-wallet/hooks/hooks-ca/contactNew';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useInputFocus } from 'hooks/useInputFocus';
import { makeStyles, useTheme } from '@rneui/themed';
import { getStringAsync } from 'expo-clipboard';
import {
  IAddContactItemApiType,
  IContactItemType,
  IEditContactItemApiType,
} from '@portkey-wallet/types/types-ca/contactNew';
import { TextL, TextM } from 'components/CommonText';
import { AELF_NETWORK_NAME } from 'constants/common';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import Touchable from 'components/Touchable';
import { KeyboardSafeArea } from 'components/KeyboardSafeArea';
import navigationService from 'utils/navigationService';

type RouterParams = {
  contact?: IContactItemType;
};

export type EditAddressType = AddressItem & { error: ErrorType };

const initEditContact: IEditContactItemApiType = {
  id: '',
  name: '',
  chainId: 'AELF',
  network: 'aelf',
  isExchange: false,
  address: '',
};
interface IFormErrorType {
  name: ErrorType;
  address: ErrorType;
}
const initFormError: IFormErrorType = {
  name: INIT_NONE_ERROR,
  address: INIT_NONE_ERROR,
};
const ContactEdit: React.FC = () => {
  const { contact } = useRouterParams<RouterParams>();
  const isEdit = useMemo(() => contact !== undefined, [contact]);

  const iptRef = useRef<TextInput>();
  useInputFocus(iptRef, !isEdit);

  // const defaultToken = useDefaultToken();
  const { t } = useLanguage();
  const pageStyles = getPageStyles();

  const addContactApi = useAddContact();
  const [formError, setFormError] = useState<IFormErrorType>(initFormError);
  const editContactApi = useEditContact();
  const deleteContactApi = useDeleteContact();

  // const { contactIndexList } = useContact();
  const [editContact, setEditContact] = useState<IEditContactItemApiType>(initEditContact);

  useEffect(() => {
    if (!contact) return;
    const _contact: IContactItemType = JSON.parse(JSON.stringify(contact));
    console.log('contact', _contact);
    const _editContact = {
      id: _contact.id,
      name: _contact.name,
      chainId: _contact.addressInfo.chainId,
      network: _contact.addressInfo.network,
      isExchange: _contact.addressInfo.isExchange ?? false,
      address: _contact.addressInfo.address,
    };
    setEditContact(_editContact);
  }, [contact]);

  const {
    theme: { colors },
  } = useTheme();
  const networkList = useNetworkList();

  const selectedNetwork = useMemo(() => {
    const network = networkList.find(item => {
      let isChainIdMatch = true;
      if (item.network === AELF_NETWORK_NAME) {
        isChainIdMatch = item.chainId === editContact.chainId;
      }
      return item.network === editContact.network && isChainIdMatch;
    });
    return network;
  }, [networkList, editContact]);
  const handleAddressChange = useCallback((value: string) => {
    setEditContact(preEditContact => {
      const _editContact = { ...preEditContact };
      _editContact.address = value;
      return _editContact;
    });
  }, []);

  const onNameChange = useCallback((value: string) => {
    setEditContact(preEditContact => ({
      ...preEditContact,
      name: value,
    }));
  }, []);

  const isSaveDisable = useMemo(() => {
    if (editContact.name?.trim() === '') return true;
    if (editContact.address?.trim() === '') return true;
    return false;
  }, [editContact]);
  const hadnleRemove = useCallback(() => {
    ActionSheet.alert({
      showInfoIcon: true,
      title: 'Confirm delete address',
      message: 'Are you sure you want to delete this saved address?',
      buttons: [
        {
          title: 'Cancel',
          type: 'outline',
        },
        {
          title: 'Delete',
          type: 'warning',
          onPress: async () => {
            if (!contact) return;
            try {
              Loading.show();
              await deleteContactApi(contact);
              CommonToast.success(t('Contact Deleted'), undefined, 'bottom');
              navigationService.navigate('ContactsHome');
            } catch (error) {
              CommonToast.failError(error);
            } finally {
              Loading.hide();
            }
          },
        },
      ],
    });
  }, [deleteContactApi, editContact.id, t]);
  const checkError = useCallback(async () => {
    const _nameValue = editContact.name.trim();

    const checkRequired = (value: string) => {
      if (value.trim() === '') {
        return {
          ...INIT_HAS_ERROR,
          errorMsg: t('Please enter contact name'),
        };
      }
      return INIT_NONE_ERROR;
    };
    const checkRegex = (value: string) => {
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return {
          ...INIT_HAS_ERROR,
          errorMsg: t('Only a-z, A-Z, 0-9 and "_"  allowed'),
        };
      }
      return INIT_NONE_ERROR;
    };
    const errorNameList = await Promise.all([checkRequired(_nameValue), checkRegex(_nameValue)]);
    const errorName = errorNameList.find(item => item.isError);
    if (errorName) {
      setFormError(preFormError => ({
        ...preFormError,
        name: errorName,
      }));
    } else {
      setFormError(preFormError => ({
        ...preFormError,
        name: INIT_NONE_ERROR,
      }));
    }
    // if (!isAelfAddress(addressItem.address)) {
    //     isErrorExist = true;
    //     addressItem.error = {
    //       ...INIT_HAS_ERROR,
    //       errorMsg: t('Invalid address'),
    //     };
    //   }

    return errorName;
  }, [editContact.name, t]);
  const onFinish = useCallback(async () => {
    try {
      Loading.show();
      console.log('start onFinish', editContact);
      const isErrorExist = await checkError();
      console.log('isErrorExist', isErrorExist, 'editContact', editContact);
      if (isErrorExist) return;
      const { id, name, address, network, isExchange, chainId } = editContact;
      const upsertParams: IAddContactItemApiType = {
        name,
        address,
        network,
      };
      const isAelf = editContact.network === AELF_NETWORK_NAME;
      if (isAelf) {
        upsertParams.chainId = chainId;
        upsertParams.isExchange = isExchange;
      }
      if (editContact.id) {
        // edit
        const updateParams = { ...upsertParams, id };
        const editContactResponse = await editContactApi(updateParams);
        console.log('editContactResponse', editContactResponse);
      } else {
        // add
        const addContactResponse = await addContactApi(upsertParams);
        console.log('newConaddContactResponsetact', addContactResponse);
      }
      CommonToast.success('Saved Successful');
      navigationService.navigate('ContactsHome');
    } catch (err: any) {
      CommonToast.failError(err);
    } finally {
      Loading.hide();
    }
  }, [addContactApi, checkError, editContact, editContactApi]);
  const pasteAddress = useCallback(async () => {
    try {
      const str = await getStringAsync();
      handleAddressChange(str);
    } catch (error) {
      console.log('pasteAddress', error);
    }
  }, [handleAddressChange]);

  return (
    <PageContainer
      safeAreaColor={['black', 'black']}
      titleDom={isEdit ? t('Edit Contact') : t('Add New Contacts')}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}
      rightDom={
        contact && (
          <Touchable style={{ paddingRight: pTd(16) }} onPress={hadnleRemove}>
            <Svg icon="remove" size={pTd(24)} />
          </Touchable>
        )
      }>
      <Input
        type="general"
        maxLength={16}
        ref={iptRef}
        label={t('Name')}
        placeholder={t('Enter name')}
        labelStyle={pageStyles.inputLabelStyle}
        value={editContact.name}
        onChangeText={onNameChange}
        errorStyle={pageStyles.errorStyle}
        errorMessage={formError.name.isError ? formError.name.errorMsg : ''}
      />
      <KeyboardAwareScrollView
        extraHeight={pTd(300)}
        keyboardShouldPersistTaps="handled"
        keyboardOpeningTime={0}
        enableOnAndroid={true}>
        <View style={GStyles.paddingArg(0, 4)}>
          <TextL style={pageStyles.inputLabelStyle}>Address</TextL>
          <ListItem
            onPress={() => {
              ChainOverlay.showList({
                list: networkList,
                value: selectedNetwork,
                onChange: item => {
                  console.log('item', item);
                  setEditContact(preEditContact => ({
                    ...preEditContact,
                    network: item.network,
                    chainId: item.chainId,
                  }));
                },
              });
            }}
            titleLeftElement={
              selectedNetwork && (
                <Image style={pageStyles.networkImage} source={{ uri: selectedNetwork?.imageUrl || '' }} />
              )
            }
            titleStyle={[]}
            // titleTextStyle={}
            // style={}
            title={selectedNetwork?.name ?? ''}
            rightElement={<Svg size={pTd(20)} icon="down-arrow" color={colors.iconBase1} />}
          />
          {/* <AddressInput
              placeholder={t("Enter contact's address")}
              value={addressValue}
              affix={affix}
              onChangeText={_onAddressChange}
              errorMessage={editAddressItem.error.isError ? editAddressItem.error.errorMsg : ''}
            /> */}
          {selectedNetwork?.network === AELF_NETWORK_NAME && (
            <View style={pageStyles.exchangeContainer}>
              <TouchableOpacity
                style={[
                  pageStyles.isExchangeItemWrap,
                  pageStyles.exchangeItemWrap,
                  editContact.isExchange && pageStyles.exchangeItemActiveWrap,
                ]}
                onPress={() => {
                  setEditContact(preEditContact => ({
                    ...preEditContact,
                    isExchange: true,
                  }));
                }}>
                {editContact.isExchange && <Svg size={pTd(20)} icon="check" color={colors.iconBrand4} />}
                <TextL style={[pageStyles.exchangeItem, editContact.isExchange && pageStyles.exchangeItemActive]}>
                  Exchange
                </TextL>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  pageStyles.nonExchangeItemWrap,
                  pageStyles.exchangeItemWrap,
                  !editContact.isExchange && pageStyles.exchangeItemActiveWrap,
                ]}
                onPress={() => {
                  setEditContact(preEditContact => ({
                    ...preEditContact,
                    isExchange: false,
                  }));
                }}>
                {!editContact.isExchange && <Svg size={pTd(20)} icon="check" color={colors.iconBrand4} />}
                <TextL style={[pageStyles.exchangeItem, !editContact.isExchange && pageStyles.exchangeItemActive]}>
                  Non-exchange
                </TextL>
              </TouchableOpacity>
            </View>
          )}
          <TextInput
            multiline
            placeholder={'Enter address'}
            value={editContact.address}
            onChangeText={handleAddressChange}
            placeholderTextColor={colors.textBase3}
            // eslint-disable-next-line react-native/no-inline-styles
            style={pageStyles.addressInput}
          />
          <View style={[GStyles.flexRow, GStyles.paddingArg(pTd(8), pTd(0))]}>
            <TextM>Enter or </TextM>
            <TextM style={pageStyles.pasteAddressText} onPress={pasteAddress}>
              paste a wallet address
            </TextM>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <KeyboardSafeArea>
        <View style={pageStyles.btnContainer}>
          <CommonButton onPress={onFinish} disabled={isSaveDisable} type="primary">
            Save address
          </CommonButton>
        </View>
      </KeyboardSafeArea>
    </PageContainer>
  );
};

export default ContactEdit;

export const getPageStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    ...GStyles.paddingArg(24, 16, 20),
  },
  errorStyle: {
    borderColor: theme.colors.borderDanger1,
  },
  inputLabelStyle: {
    fontSize: pTd(16),
    lineHeight: pTd(22),
    paddingLeft: 0,
    color: theme.colors.textBase1,
    marginBottom: pTd(8),
  },
  exchangeContainer: {
    flexDirection: 'row',
    marginTop: pTd(16),
    gap: pTd(8),
  },
  exchangeItemWrap: {
    flex: 1,
    height: pTd(32),
    borderRadius: pTd(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bgNeutral2,
  },
  exchangeItemActiveWrap: {
    backgroundColor: theme.colors.bgBrand1,
  },
  isExchangeItemWrap: {
    marginRight: pTd(4),
  },
  nonExchangeItemWrap: {
    marginLeft: pTd(4),
  },
  addressInput: {
    borderColor: theme.colors.borderBase1,
    borderWidth: StyleSheet.hairlineWidth,
    height: pTd(80),
    borderRadius: pTd(8),
    paddingHorizontal: pTd(16),
    paddingTop: pTd(12),
    paddingBottom: pTd(12),
    marginTop: pTd(16),
  },
  exchangeItem: {
    lineHeight: pTd(16),
    color: theme.colors.textNeutral5,
    paddingLeft: pTd(4),
  },
  exchangeItemActive: {
    color: theme.colors.textBrand4,
  },
  btnContainer: {
    paddingTop: pTd(16),
  },
  pasteAddressText: {
    color: theme.colors.textBrand2,
  },
  networkImage: {
    width: pTd(16),
    height: pTd(16),
  },
}));
