import React from 'react';
import { View } from 'react-native';
import { FontStyles } from 'assets/theme/styles';
import { TextL } from 'components/CommonText';
import { ContactIndexType, ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { ViewStyleType } from 'types/styles';
import ContactFlashList from './ContactFlashList';
import { styles as contactListStyles } from './style';
import { styles as contactItemStyles } from 'components/ContactItem';
interface ContactsListProps {
  contactData: ContactItemType[];
  justChatContact?: boolean;
  isIndexBarShow?: boolean;
  isSearchShow?: boolean; // blocked because of massive errors
  isContactUpdateWarningShow?: boolean; // won't support
  isReadOnly?: boolean;
  renderContactItem?: (item: ContactItemType) => JSX.Element;
  itemHeight?: number;
  style?: ViewStyleType;
  ListFooterComponent?: JSX.Element;
}
const ContactsList: React.FC<ContactsListProps> = ({
  renderContactItem,
  itemHeight,
  style,
  ListFooterComponent,
  contactData,
}) => {
  // const navToChatDetails = useJumpToChatDetails();

  // const isShowChat = useIsChatShow();
  // const isShowChat = false; // sdk won't support chat func

  const _renderSection = (contactIndex: ContactIndexType) => {
    return (
      <TextL key={contactIndex.index} style={[contactListStyles.sectionIndex, FontStyles.font7]}>
        {contactIndex.index}
      </TextL>
    );
  };

  const _renderItem = (item: ContactItemType) => {
    if (renderContactItem) return renderContactItem(item);
    throw new Error(
      "you run into this error since you are trying to update the contract module's code, " +
        "update your code from Portkey APP's mono repo first.",
    );
  };
  return (
    <View style={[contactListStyles.listWrap, style]}>
      <ContactFlashList
        dataArray={contactData}
        contactIndexList={[{ index: '', contacts: contactData }]}
        sectionHeight={contactListStyles.sectionIndex.height}
        itemHeight={itemHeight || contactItemStyles.itemWrap.height}
        renderContactIndex={_renderSection}
        renderContactItem={_renderItem}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
};
export default ContactsList;
