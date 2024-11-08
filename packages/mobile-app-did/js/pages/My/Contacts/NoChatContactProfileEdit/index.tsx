import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, TextInput, View, Image, TouchableOpacity } from 'react-native';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import {
  AddressItem,
  // ContactItemType, EditContactItemApiType
} from '@portkey-wallet/types/types-ca/contact';
import Input from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import ListItem from 'components/ListItem';
// import navigationService from 'utils/navigationService';
// import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import {
  // INIT_HAS_ERROR,
  INIT_NONE_ERROR,
  ErrorType,
  INIT_HAS_ERROR,
} from '@portkey-wallet/constants/constants-ca/common';
// import ContactAddress from '../ContactEdit/components/ContactAddress';
// import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import ChainOverlay from 'pages/My/Contacts/ContactChainOverlay';
// import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import CommonToast from 'components/CommonToast';
// import ActionSheet from 'components/ActionSheet';
// import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import {
  useAddContact,
  useCheckContactName,
  // useContact,
  // useDeleteContact,
  // useEditContact,
} from '@portkey-wallet/hooks/hooks-ca/contactNew';
import { useNetworkList } from '@portkey-wallet/hooks/hooks-ca/contactNew';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { defaultColors } from 'assets/theme';
import { useInputFocus } from 'hooks/useInputFocus';
import { makeStyles, useTheme } from '@rneui/themed';
import {
  IAddContactItemApiType,
  IContactItemType,
  IEditContactItemApiType,
  // INetworkItemType,
} from '@portkey-wallet/types/types-ca/contactNew';
import { TextL } from 'components/CommonText';
import { AELF_NETWORK_NAME } from 'constants/common';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';

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
  const checkContactName = useCheckContactName();
  const [formError, setFormError] = useState<IFormErrorType>(initFormError);
  // const editContactApi = useEditContact();
  // const deleteContactApi = useDeleteContact();

  // const { contactIndexList } = useContact();
  const [editContact, setEditContact] = useState<IEditContactItemApiType>(initEditContact);

  useEffect(() => {
    if (!contact) return;
    const _contact: IContactItemType = JSON.parse(JSON.stringify(contact));
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
    const network = networkList.find(
      item => item.network === editContact.network && item.chainId === editContact.chainId,
    );
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
    const checkNameExist = async (value: string) => {
      const checkContactNameExist = await checkContactName(value);
      if (checkContactNameExist.existed) {
        return {
          ...INIT_HAS_ERROR,
          errorMsg: t('This name already exists.'),
        };
      }
      return INIT_NONE_ERROR;
    };
    const errorNameList = await Promise.all([
      checkRequired(_nameValue),
      checkRegex(_nameValue),
      // checkNameExist(_nameValue),
    ]);
    console.log('errorNameList', errorNameList);
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
  }, [checkContactName, editContact.name, t]);
  const onFinish = useCallback(async () => {
    try {
      console.log('start onFinish', editContact);
      const isErrorExist = await checkError();
      Loading.show();
      console.log('isErrorExist', isErrorExist, 'editContact', editContact);
      if (isErrorExist) return;
      const { id, name, address, network, isExchange, chainId } = editContact;
      if (editContact.id) {
        // edit
      } else {
        // add
        const addParams: IAddContactItemApiType = {
          name,
          address,
          network,
        };
        const isAelf = editContact.network === AELF_NETWORK_NAME;
        if (isAelf) {
          addParams.chainId = chainId;
          addParams.isExchange = isExchange;
        }
        const newContact = await addContactApi(addParams);
        console.log('newContact', newContact);
      }
      CommonToast.success('Saved Successful');
    } catch (err: any) {
      CommonToast.failError(err);
    } finally {
      Loading.hide();
    }
  }, [addContactApi, checkError, editContact]);

  return (
    <PageContainer
      safeAreaColor={['black', 'black']}
      titleDom={isEdit ? t('Edit Contact') : t('Add New Contacts')}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
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
        </View>
      </KeyboardAwareScrollView>
      <View style={pageStyles.btnContainer}>
        <CommonButton onPress={onFinish} disabled={isSaveDisable} type="primary">
          {/* {isEdit ? t('Save') : t('Add')} */}
          Save address
        </CommonButton>
        {/* {isEdit && (
          <CommonButton
            style={pageStyles.deleteBtnStyle}
            onPress={onDelete}
            titleStyle={FontStyles.font12}
            type="clear">
            {t('Delete')}
          </CommonButton>
        )} */}
      </View>
    </PageContainer>
  );
};

export default ContactEdit;

const { error1, font5, font4 } = defaultColors;

export const getPageStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    ...GStyles.paddingArg(24, 16, 20),
  },
  addAddressBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: pTd(110),
  },
  inputStyle: {
    color: font5,
  },
  errorStyle: {
    borderColor: theme.colors.borderDanger1,
  },
  inputStyle1: {
    backgroundColor: 'red',
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
  networkImage: {},
}));
