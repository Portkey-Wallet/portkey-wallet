import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { styles as contactListStyles } from './style';
import { IContactIndexType, IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import { FlashList } from '@shopify/flash-list';
import IndexBar from 'components/IndexBar';

type contactFlatItemType = IContactIndexType | IContactItemType;
interface ContactsListProps {
  dataArray: contactFlatItemType[];
  contactIndexList: IContactIndexType[];
  isIndexBarShow?: boolean;
  sectionHeight?: number;
  itemHeight?: number;
  ListFooterComponent?: JSX.Element;
  renderContactItem: (item: IContactItemType) => JSX.Element;
  renderContactIndex: (contactIndex: IContactIndexType) => JSX.Element;
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
          layout.size = (item as IContactItemType).id === undefined ? sectionHeight : itemHeight;
        }}
        renderItem={({ item }) => {
          if ((item as IContactItemType).id === undefined) {
            return renderContactIndex(item as IContactIndexType);
          }
          return renderContactItem(item as IContactItemType);
        }}
        getItemType={item => {
          return (item as IContactItemType).id === undefined ? 'sectionHeader' : 'row';
        }}
        keyExtractor={item =>
          (item as IContactItemType).id === undefined ? item.index : (item as IContactItemType).id
        }
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
