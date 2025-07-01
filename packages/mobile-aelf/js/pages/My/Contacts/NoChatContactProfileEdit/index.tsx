import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TextInput, View, Image, TouchableOpacity } from 'react-native';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { IAddressInfo } from '@portkey-wallet/types/types-eoa/contact';
import Input from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import isEqual from 'lodash/isEqual';
import ActionSheet from 'components/ActionSheet';
import ListItem from 'components/ListItem';
import GStyles from 'assets/theme/GStyles';
import { INIT_NONE_ERROR, ErrorType, INIT_HAS_ERROR } from '@portkey-wallet/constants/constants-eoa/common';
import ChainOverlay from 'pages/My/Contacts/ContactChainOverlay';
import { useAddContact, useDeleteContact, useEditContact } from '@portkey-wallet/hooks/hooks-eoa/contact';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useInputFocus } from 'hooks/useInputFocus';
import { makeStyles, useTheme } from '@rneui/themed';
import { getStringAsync } from 'expo-clipboard';
import {
  IAddContactItemApiType,
  IContactItemType,
  IEditContactItemApiType,
} from '@portkey-wallet/types/types-eoa/contact';
import { TextL, TextM } from 'components/CommonText';
import { AELF_NETWORK_NAME } from 'constants/common';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import Touchable from 'components/Touchable';
import { KeyboardSafeArea } from 'components/KeyboardSafeArea';
import navigationService from 'utils/navigationService';
import { useContactNetworkConfig } from '@portkey-wallet/hooks/hooks-eoa/config';
import { RECENT_PAGE_NAME } from 'constants/contact';
import { SupportedELFChainId } from '@portkey-wallet/utils/eBridge/constants';
import { getAddressInfo, isAelfAddress } from '@portkey-wallet/utils/aelf';
import myEvents from 'utils/deviceEvent';
import { isIOS } from '@rneui/base';

type RouterParams = {
  contact?: IContactItemType;
  willAddContact?: IContactItemType;
  from?: string;
};

export type EditAddressType = IAddressInfo & { error: ErrorType };

const initEditContact: IEditContactItemApiType = {
  id: '',
  name: '',
  chainId: 'AELF',
  network: 'aelf',
  isExchange: false,
  address: '',
};
interface IFormErrorType {
  name?: ErrorType;
  address?: ErrorType;
}
const initFormError: IFormErrorType = {
  name: INIT_NONE_ERROR,
  address: INIT_NONE_ERROR,
};
const invalidAddressMessage = 'Please enter a valid address.';
const errorCodeMessageMap: Record<string, IFormErrorType> = {
  40021: {
    name: {
      ...INIT_HAS_ERROR,
      errorMsg: 'Name already in use.',
    },
  },
  40022: {
    address: {
      ...INIT_HAS_ERROR,
      errorMsg: invalidAddressMessage,
    },
  },
};
const ContactEdit: React.FC = () => {
  const { contact, willAddContact, from } = useRouterParams<RouterParams>();
  const isEdit = useMemo(() => contact !== undefined, [contact]);

  const iptRef = useRef<TextInput>();
  useInputFocus(iptRef, !isEdit, 100);

  // const defaultToken = useDefaultToken();
  const { t } = useLanguage();
  const pageStyles = getPageStyles();

  const addContactApi = useAddContact();
  const [formError, setFormError] = useState<IFormErrorType>(initFormError);
  const editContactApi = useEditContact();
  const deleteContactApi = useDeleteContact();

  // const { contactIndexList } = useContact();
  const [editContact, setEditContact] = useState<IEditContactItemApiType>(initEditContact);

  // exist contact, enter edit page, fill form default value
  const editDefaultValue = useMemo(() => {
    if (!contact) {
      return initEditContact;
    }
    const _contact: IContactItemType = JSON.parse(JSON.stringify(contact));
    const _editContact = {
      id: _contact.id,
      name: _contact.name,
      chainId: _contact.addressInfo.chainId,
      network: _contact.addressInfo.network,
      isExchange: _contact.addressInfo.isExchange ?? false,
      address: _contact.addressInfo.address,
    };
    return _editContact;
  }, [contact]);
  useEffect(() => {
    setEditContact(editDefaultValue);
  }, [editDefaultValue]);
  // no exist contact, enter add page, fill form default value
  useEffect(() => {
    if (!willAddContact) {
      return;
    }
    const _contact: IContactItemType = JSON.parse(JSON.stringify(willAddContact));
    const _editContact = {
      name: '',
      chainId: _contact.addressInfo.chainId,
      network: _contact.addressInfo.network,
      isExchange: _contact.addressInfo.isExchange ?? false,
      address: _contact.addressInfo.address,
    };
    setEditContact(_editContact);
  }, [willAddContact]);

  const {
    theme: { colors },
  } = useTheme();
  const { supportNetworkList } = useContactNetworkConfig();

  const selectedNetwork = useMemo(() => {
    const network = supportNetworkList?.find(item => {
      let isChainIdMatch = true;
      if (item.network === AELF_NETWORK_NAME) {
        isChainIdMatch = item.chainId === editContact.chainId;
      }
      return item.network === editContact.network && isChainIdMatch;
    });
    return network;
  }, [supportNetworkList, editContact]);
  const handleAddressChange = useCallback((value: string) => {
    setEditContact(preEditContact => {
      const _editContact = { ...preEditContact };
      _editContact.address = value;
      return _editContact;
    });
    setFormError(preFormError => ({
      ...preFormError,
      address: INIT_NONE_ERROR,
    }));
  }, []);

  const onNameChange = useCallback((value: string) => {
    setEditContact(preEditContact => ({
      ...preEditContact,
      name: value,
    }));
    setFormError(preFormError => ({
      ...preFormError,
      name: INIT_NONE_ERROR,
    }));
  }, []);

  const isAddDisable = useMemo(() => {
    // did not fill name or address or select network
    return editContact.name?.trim() === '' || editContact.address?.trim() === '' || !selectedNetwork;
  }, [editContact, selectedNetwork]);
  const isEditDisable = useMemo(() => {
    // did not change any value
    return isEqual(editContact, editDefaultValue);
  }, [editContact, editDefaultValue]);
  const isSaveDisable = isEdit ? isEditDisable : isAddDisable;
  const handleRemove = useCallback(() => {
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
            if (!contact) {
              return;
            }
            try {
              Loading.show();
              await deleteContactApi(contact);
              CommonToast.success(t('Address deleted'), undefined, 'bottom');
              myEvents.updateSendAddressList.emit();
              if (from === RECENT_PAGE_NAME) {
                // go back two pages
                navigationService.goBack();
                navigationService.goBack();
              } else {
                navigationService.navigate('ContactsHome');
              }
            } catch (error) {
              CommonToast.failError(error);
            } finally {
              Loading.hide();
            }
          },
        },
      ],
    });
  }, [contact, deleteContactApi, from, t]);
  const checkError = useCallback(async () => {
    const _nameValue = editContact.name.trim();
    const _addressValue = editContact.address;

    const checkRequired = (value: string) => {
      if (value.trim() === '') {
        return {
          ...INIT_HAS_ERROR,
          errorMsg: t('Please enter contact name.'),
        };
      }
      return INIT_NONE_ERROR;
    };
    const checkRegex = (value: string) => {
      if (!/^[a-zA-Z0-9_ ]+$/.test(value)) {
        return {
          ...INIT_HAS_ERROR,
          errorMsg: t('Only a-z, A-Z, 0-9, spaces and "_" allowed.'),
        };
      }
      return INIT_NONE_ERROR;
    };
    const checkAddressChainId = (address: string) => {
      const addressInfo = getAddressInfo(address);
      if (selectedNetwork?.chainId && addressInfo.suffix && selectedNetwork.chainId !== addressInfo.suffix) {
        return {
          ...INIT_HAS_ERROR,
          errorMsg: invalidAddressMessage,
        };
      }
      return INIT_NONE_ERROR;
    };
    const checkAddressIsValid = ({ address, network }: { address: string; network: string; isExchange: boolean }) => {
      let isPass = true;

      if (network === 'aelf') {
        isPass = !!isAelfAddress(address);
      } else {
        const pattern = supportNetworkList?.find(ele => ele.network === network)?.pattern || '';
        const regex = new RegExp(pattern);
        isPass = regex.test(address);
      }

      console.log('===pass', isPass);

      return isPass
        ? INIT_NONE_ERROR
        : {
            ...INIT_HAS_ERROR,
            errorMsg: invalidAddressMessage,
          };
    };

    const [errorNameList, errorAddressList] = await Promise.all([
      [checkRequired(_nameValue), checkRegex(_nameValue)],
      [
        checkAddressChainId(_addressValue),
        checkAddressIsValid({
          address: editContact.address,
          network: editContact.network,
          isExchange: !!editContact?.isExchange,
        }),
      ],
    ]);

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
    const errorAddress = errorAddressList.find(item => item.isError);
    if (errorAddress) {
      setFormError(preFormError => ({
        ...preFormError,
        address: errorAddress,
      }));
    } else {
      setFormError(preFormError => ({
        ...preFormError,
        address: INIT_NONE_ERROR,
      }));
    }

    return errorName || errorAddress;
  }, [
    editContact.address,
    editContact?.isExchange,
    editContact.name,
    editContact.network,
    selectedNetwork?.chainId,
    supportNetworkList,
    t,
  ]);
  const onFinish = useCallback(async () => {
    try {
      Loading.show();
      const isErrorExist = await checkError();
      if (isErrorExist) {
        return;
      }
      const { id, name, address, network, isExchange, chainId } = editContact;
      const upsertParams: IAddContactItemApiType = {
        name: name.trim(),
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
        if (from === RECENT_PAGE_NAME) {
          navigationService.navigate('NoChatContactProfile', {
            contact: editContactResponse,
            isSaved: true,
            from,
          });
        } else {
          navigationService.navigate('ContactsHome');
        }
      } else {
        // add
        const addContactResponse = await addContactApi(upsertParams);
        if (from === RECENT_PAGE_NAME) {
          navigationService.navigate('NoChatContactProfile', {
            contact: addContactResponse,
            isSaved: true,
            from,
          });
        } else {
          navigationService.navigate('ContactsHome');
        }
      }
      myEvents.updateSendAddressList.emit();
      CommonToast.success('Address saved');
    } catch (err: any) {
      const errorCode = err?.error?.code;
      const formItemError = errorCodeMessageMap[errorCode];
      if (formItemError) {
        setFormError(formItemError);
      } else {
        setFormError(initFormError);
        CommonToast.failError(err);
      }
    } finally {
      Loading.hide();
    }
  }, [addContactApi, checkError, editContact, editContactApi, from]);
  const pasteAddress = useCallback(async () => {
    try {
      const str = await getStringAsync();
      handleAddressChange(str);
    } catch (error) {
      console.log('pasteAddress', error);
    }
  }, [handleAddressChange]);

  const renderSaveButton = useCallback(() => {
    return (
      <View style={pageStyles.btnContainer}>
        <CommonButton onPress={onFinish} disabled={isSaveDisable} type="primary">
          Save address
        </CommonButton>
      </View>
    );
  }, [isSaveDisable, onFinish, pageStyles.btnContainer]);
  return (
    <PageContainer
      safeAreaColor={['black', 'black']}
      titleDom={isEdit ? 'Edit Address' : 'Add Address'}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}
      rightDom={
        contact && (
          <Touchable style={{ paddingRight: pTd(16) }} onPress={handleRemove}>
            <Svg icon="remove" size={pTd(24)} />
          </Touchable>
        )
      }>
      <View style={pageStyles.formWrap}>
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
          errorMessage={formError.name?.isError ? formError.name?.errorMsg : ''}
        />

        <View>
          <TextL style={pageStyles.inputLabelStyle}>Address</TextL>
          <ListItem
            onPress={() => {
              ChainOverlay.showList({
                list: supportNetworkList || [],
                value: selectedNetwork,
                onChange: item => {
                  setFormError(preFormError => ({
                    ...preFormError,
                    address: INIT_NONE_ERROR,
                  }));
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
            titleTextStyle={pageStyles.titleTextStyle}
            title={selectedNetwork?.name ?? ''}
            rightElement={<Svg size={pTd(20)} icon="down-arrow" color={colors.iconBase1} />}
          />
          {selectedNetwork?.network === AELF_NETWORK_NAME && selectedNetwork.chainId === SupportedELFChainId.AELF && (
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
                {!editContact.isExchange && <Svg size={pTd(20)} icon="check" color={colors.iconBrandOn} />}
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
            autoCapitalize="none"
            placeholderTextColor={colors.textBase3}
            // eslint-disable-next-line react-native/no-inline-styles
            style={[pageStyles.addressInput, formError.address?.isError && pageStyles.errorStyle]}
          />
          {formError.address?.isError && <TextL style={pageStyles.errorMessage}>{formError.address?.errorMsg}</TextL>}
          <View style={[GStyles.flexRow, GStyles.paddingArg(pTd(8), pTd(0))]}>
            <TextM>Enter or </TextM>
            <TextM style={pageStyles.pasteAddressText} onPress={pasteAddress}>
              paste a wallet address
            </TextM>
          </View>
        </View>
      </View>
      {isIOS ? <KeyboardSafeArea>{renderSaveButton()}</KeyboardSafeArea> : renderSaveButton()}
    </PageContainer>
  );
};

export default ContactEdit;

export const getPageStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    ...GStyles.paddingArg(24, 16, 20),
  },
  formWrap: {
    flex: 1,
  },
  errorStyle: {
    borderColor: theme.colors.borderDanger1,
  },
  errorMessage: {
    color: theme.colors.textDanger2,
    paddingTop: pTd(8),
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
    backgroundColor: theme.colors.bgBrandDefault,
  },
  isExchangeItemWrap: {
    marginRight: pTd(4),
  },
  nonExchangeItemWrap: {
    marginLeft: pTd(4),
  },
  addressInput: {
    borderColor: theme.colors.borderBase1,
    borderWidth: pTd(1),
    height: pTd(80),
    borderRadius: pTd(8),
    paddingHorizontal: pTd(16),
    paddingTop: pTd(12),
    paddingBottom: pTd(12),
    marginTop: pTd(16),
    verticalAlign: 'top',
  },
  exchangeItem: {
    lineHeight: pTd(16),
    color: theme.colors.textNeutral5,
    paddingLeft: pTd(4),
  },
  exchangeItemActive: {
    color: theme.colors.textBrandOn,
  },
  btnContainer: {
    marginBottom: pTd(14),
  },
  pasteAddressText: {
    color: theme.colors.textBrandDefault,
  },
  networkImage: {
    width: pTd(16),
    height: pTd(16),
    marginRight: pTd(8),
  },
  titleTextStyle: {
    fontSize: pTd(16),
    lineHeight: pTd(16),
  },
}));
