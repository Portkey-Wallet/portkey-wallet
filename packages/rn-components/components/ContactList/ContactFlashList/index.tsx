import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { styles as contactListStyles } from './style';
import { ContactIndexType, ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { FlashList } from '@shopify/flash-list';
import IndexBar from '../../IndexBar';

type contactFlatItemType = ContactIndexType | ContactItemType;
interface ContactsListProps {
  dataArray: contactFlatItemType[];
  contactIndexList: ContactIndexType[];
  isIndexBarShow?: boolean;
  sectionHeight?: number;
  itemHeight?: number;
  ListFooterComponent?: JSX.Element;
  renderContactItem: (item: ContactItemType) => JSX.Element;
  renderContactIndex: (contactIndex: ContactIndexType) => JSX.Element;
}

const ContactsList: React.FC<ContactsListProps> = ({
  dataArray,
  contactIndexList,
  sectionHeight = 28,
  itemHeight = 85,
  isIndexBarShow = true,
  ListFooterComponent = null,
  renderContactItem,
  renderContactIndex,
}) => {
  const flashListRef = useRef<FlashList<contactFlatItemType>>(null);

  const onSectionSelect = useCallback(
    (index: number) => {
      flashListRef.current?.scrollToIndex({
        index: contactIndexList.reduce(
          (pv, cv, idx) => pv + (idx < index && cv.contacts.length ? cv.contacts.length + 1 : 0),
          0,
        ),
      });
    },
    [contactIndexList],
  );

  return (
    <View style={[contactListStyles.sectionListWrap, !isIndexBarShow && contactListStyles.sectionListWrapFull]}>
      <FlashList
        ref={flashListRef}
        showsVerticalScrollIndicator={false}
        data={dataArray}
        estimatedItemSize={contactListStyles.sectionIndex.height}
        overrideItemLayout={(layout, item) => {
          layout.size = (item as ContactItemType).id === undefined ? sectionHeight : itemHeight;
        }}
        renderItem={({ item }) => {
          if ((item as ContactItemType).id === undefined) {
            return renderContactIndex(item as ContactIndexType);
          }
          return renderContactItem(item as ContactItemType);
        }}
        getItemType={item => {
          return (item as ContactItemType).id === undefined ? 'sectionHeader' : 'row';
        }}
        keyExtractor={item => ((item as ContactItemType).id === undefined ? item.index : (item as ContactItemType).id)}
        ListFooterComponent={ListFooterComponent}
      />

      {isIndexBarShow && (
        <View style={contactListStyles.indexBarWrap}>
          <IndexBar
            showPopover
            data={contactIndexList.map(item => item.index)}
            onPress={index => onSectionSelect(index)}
            disableIndexSelect={true}
          />
        </View>
      )}
    </View>
  );
};
export default ContactsList;
