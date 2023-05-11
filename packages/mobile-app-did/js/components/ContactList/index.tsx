import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Text, View } from 'react-native';
import CommonInput from 'components/CommonInput';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { styles as contactListStyles } from './style';
import CommonButton from 'components/CommonButton';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ContactIndexType, ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import ContactItem, { styles as contactItemStyles } from 'components/ContactItem';
import ContactFlashList from './ContactFlashList';
import { TextL } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import { ViewStyleType } from 'types/styles';
import { getAddressInfo } from '@portkey-wallet/utils/aelf';
import { transContactsToIndexes } from '@portkey-wallet/store/store-ca/contact/utils';
import { useContact } from '@portkey-wallet/hooks/hooks-ca/contact';

interface ContactsListProps {
  isIndexBarShow?: boolean;
  isSearchShow?: boolean;
  isReadOnly?: boolean;
  renderContactItem?: (item: ContactItemType) => JSX.Element;
  itemHeight?: number;
  style?: ViewStyleType;
  ListFooterComponent?: JSX.Element;
}
type FlashItemType = ContactIndexType | ContactItemType;

const ContactsList: React.FC<ContactsListProps> = ({
  isIndexBarShow = true,
  isSearchShow = true,
  isReadOnly = false,
  renderContactItem,
  itemHeight,
  style,
  ListFooterComponent,
}) => {
  const { t } = useLanguage();
  const { contactIndexList, contactMap } = useContact();
  const [list, setList] = useState<ContactIndexType[]>([]);

  const flashListData = useMemo<FlashItemType[]>(() => {
    let _flashListData: FlashItemType[] = [];
    list.forEach(contactIndex => {
      if (!contactIndex.contacts.length) return;
      _flashListData.push({
        ...contactIndex,
      });
      _flashListData = _flashListData.concat(contactIndex.contacts);
    });
    return _flashListData;
  }, [list]);

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
          contacts: contacts.filter(contact => contact.name.toLocaleUpperCase() === _value.toLocaleUpperCase()),
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
            result = contactMap[addressInfo.address].filter(item =>
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
        onPress={() => {
          navigationService.navigate('ContactDetail', { contact: item });
        }}
      />
    );
  };

  const isExistContact = useMemo<boolean>(() => list.reduce((pv, cv) => pv + cv.contacts.length, 0) > 0, [list]);

  const indexList = useMemo(() => contactIndexList.filter(item => item.contacts.length), [contactIndexList]);

  return (
    <View style={[contactListStyles.listWrap, style]}>
      {isSearchShow && (
        <View style={[BGStyles.bg5, GStyles.paddingArg(0, 20, 16)]}>
          <CommonInput
            value={keyWord}
            placeholder={t('Name or address')}
            onChangeText={value => {
              onChangeKeywords(value);
            }}
          />
        </View>
      )}

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
          onPress={() => navigationService.navigate('ContactEdit')}>
          <Svg icon="add1" size={pTd(16)} color={defaultColors.icon2} />
          <Text style={contactListStyles.addText}>{t('Add New Contacts')}</Text>
        </CommonButton>
      )}
    </View>
  );
};
export default ContactsList;
