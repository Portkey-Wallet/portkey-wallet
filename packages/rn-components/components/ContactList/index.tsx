import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Text, View } from 'react-native';
import CommonInput from '@portkey-wallet/rn-components/components/CommonInput';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import { styles as contactListStyles } from './style';
import CommonButton from '@portkey-wallet/rn-components/components/CommonButton';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import { ContactIndexType, ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import ContactItem, { styles as contactItemStyles } from '@portkey-wallet/rn-components/components/ContactItem';
import ContactFlashList from './ContactFlashList';
import { TextL } from '@portkey-wallet/rn-components/components/CommonText';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import { BGStyles, FontStyles } from '@portkey-wallet/rn-base/assets/theme/styles';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import { ViewStyleType } from '@portkey-wallet/rn-base/types/styles';
import { getAddressInfo } from '@portkey-wallet/utils/aelf';
import { transContactsToIndexes } from '@portkey-wallet/store/store-ca/contact/utils';
import { useContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import { useJumpToChatDetails } from '@portkey-wallet/rn-base/hooks/chat';
import ContactUpdateWarning from '../ContactUpdateWarning';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
interface ContactsListProps {
  justChatContact?: boolean;
  isIndexBarShow?: boolean;
  isSearchShow?: boolean;
  isContactUpdateWarningShow?: boolean;
  isReadOnly?: boolean;
  renderContactItem?: (item: ContactItemType) => JSX.Element;
  itemHeight?: number;
  style?: ViewStyleType;
  ListFooterComponent?: JSX.Element;
}
type FlashItemType = ContactIndexType | ContactItemType;

const ContactsList: React.FC<ContactsListProps> = ({
  justChatContact = false,
  isIndexBarShow = true,
  isSearchShow = true,
  isContactUpdateWarningShow = false,
  isReadOnly = false,
  renderContactItem,
  itemHeight,
  style,
  ListFooterComponent,
}) => {
  const { t } = useLanguage();
  const { contactIndexList, contactMap } = useContact(!justChatContact);
  const [list, setList] = useState<ContactIndexType[]>([]);
  const navToChatDetails = useJumpToChatDetails();
  const isShowChat = useIsChatShow();

  const chatContactIndexList = useMemo(() => {
    const _chatContactIndexList: ContactIndexType[] = [];

    contactIndexList.map(ele => {
      const chatList = ele.contacts.filter(contact => !!contact.imInfo);
      if (chatList.length > 0) {
        _chatContactIndexList.push({
          contacts: chatList,
          index: ele.index,
        });
      }
    });

    return _chatContactIndexList;
  }, [contactIndexList]);

  const flashListData = useMemo<FlashItemType[]>(() => {
    let _flashListData: FlashItemType[] = [];
    list.forEach(contactIndex => {
      if (!contactIndex.contacts.length) return;

      if (justChatContact) {
        // just chatContact
        const indexContactList = contactIndex.contacts.filter(ele => !!ele.imInfo);
        if (indexContactList.length > 0) {
          _flashListData.push({
            contacts: indexContactList,
            index: contactIndex.index,
          });
          _flashListData = _flashListData.concat(indexContactList);
        }
      } else {
        _flashListData.push({
          ...contactIndex,
        });
        _flashListData = _flashListData.concat(contactIndex.contacts);
      }
    });
    return _flashListData;
  }, [justChatContact, list]);

  const [keyWord, setKeyWord] = useState<string>('');

  useEffect(() => {
    setList(contactIndexList);
    setKeyWord('');
  }, [contactIndexList]);

  // keyword filter;
  const onChangeKeywords = useCallback(
    (value: string) => {
      setKeyWord(value);
      const _value = value.trim();
      if (_value === '') {
        setList(contactIndexList);
        return;
      }

      let filterList: ContactIndexType[] = [];
      if (_value.length <= 16) {
        // Name Search
        filterList = contactIndexList.map(({ index, contacts }) => ({
          index,
          contacts: contacts.filter(contact => contact.name.toLocaleUpperCase().includes(_value.toLocaleUpperCase())),
        }));
      } else {
        // Address Search
        const addressInfo = getAddressInfo(_value);
        let result: ContactItemType[] | undefined;
        if (addressInfo.address) {
          if (!addressInfo.suffix) {
            // no suffix
            result = contactMap[addressInfo.address];
          } else {
            result = contactMap[addressInfo.address]?.filter(item =>
              item.addresses.find(address => address.chainId === addressInfo.suffix),
            );
          }
        }
        if (result === undefined) filterList = [];
        else filterList = transContactsToIndexes(result);
      }

      setList(filterList);
    },
    [contactIndexList, contactMap],
  );

  const _renderSection = (contactIndex: ContactIndexType) => {
    return (
      <TextL key={contactIndex.index} style={[contactListStyles.sectionIndex, FontStyles.font7]}>
        {contactIndex.index}
      </TextL>
    );
  };

  const _renderItem = (item: ContactItemType) => {
    if (renderContactItem) return renderContactItem(item);
    return (
      <ContactItem
        key={item.id}
        contact={item}
        isShowChat={isShowChat && !!item.imInfo?.relationId}
        isShowWarning={item.isImputation}
        onPress={() => {
          // adjust no chat func
          if (!isShowChat)
            return navigationService.navigate('NoChatContactProfile', {
              contactId: item.id,
              isCheckImputation: true,
            });

          navigationService.navigate(item.imInfo?.relationId ? 'ChatContactProfile' : 'NoChatContactProfile', {
            contactId: item.id,
            isCheckImputation: true,
          });
        }}
        onPressChat={() => {
          if (!item?.imInfo?.relationId) return;
          navToChatDetails({ toRelationId: item?.imInfo?.relationId || '' });
        }}
      />
    );
  };

  const isExistContact = useMemo<boolean>(() => list.reduce((pv, cv) => pv + cv.contacts.length, 0) > 0, [list]);

  const indexList = useMemo(() => {
    if (justChatContact) {
      return chatContactIndexList;
    } else {
      return contactIndexList.filter(item => item.contacts.length);
    }
  }, [chatContactIndexList, contactIndexList, justChatContact]);

  return (
    <View style={[contactListStyles.listWrap, style]}>
      {isSearchShow && (
        <View style={[BGStyles.bg5, GStyles.paddingArg(8, 20, 8)]}>
          <CommonInput
            value={keyWord}
            placeholder={t('Name/address')}
            onChangeText={value => {
              onChangeKeywords(value);
            }}
          />
        </View>
      )}
      {isContactUpdateWarningShow && <ContactUpdateWarning />}
      {isExistContact && (
        <ContactFlashList
          dataArray={flashListData}
          contactIndexList={indexList}
          sectionHeight={contactListStyles.sectionIndex.height}
          itemHeight={itemHeight || contactItemStyles.itemWrap.height}
          renderContactIndex={_renderSection}
          renderContactItem={_renderItem}
          isIndexBarShow={isIndexBarShow && !keyWord}
          ListFooterComponent={ListFooterComponent}
        />
      )}

      {!isExistContact && !!keyWord && (
        <TextL style={[contactListStyles.noResult, FontStyles.font7]}>{t('No results found')}</TextL>
      )}

      {!isExistContact && !keyWord && !isReadOnly && (
        <CommonButton
          type="solid"
          containerStyle={contactListStyles.addButtonWrap}
          buttonStyle={[contactListStyles.addButton]}
          onPress={() => navigationService.navigate('NoChatContactProfileEdit')}>
          <Svg icon="add1" size={pTd(16)} color={defaultColors.icon2} />
          <Text style={contactListStyles.addText}>{t('Add New Contacts')}</Text>
        </CommonButton>
      )}
    </View>
  );
};
export default ContactsList;
