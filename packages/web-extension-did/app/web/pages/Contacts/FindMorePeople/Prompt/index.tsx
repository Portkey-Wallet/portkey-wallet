import ContactsSearchInput from 'pages/Contacts/components/ContactsSearchInput';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IFindMorePeopleProps } from '..';
import ContactList from 'pages/Contacts/components/ContactList';
import './index.less';

export default function FindMorePeoplePrompt({
  headerTitle,
  myPortkeyId,
  contactList,
  isMainnet,
  goBack,
  handleSearch,
  clickItem,
  clickChat,
}: IFindMorePeopleProps) {
  return (
    <div className="find-more-people-prompt">
      <div className="flex-column find-more-people-top">
        <SecondPageHeader
          className="find-more-people-header"
          paddingLeft={12}
          title={headerTitle}
          leftCallBack={goBack}
        />
        <ContactsSearchInput
          className="find-more-people-search"
          placeholder="Portkey ID/Address"
          handleChange={handleSearch}
        />
        <div className="find-more-people-id">My Portkey ID: {myPortkeyId}</div>
      </div>
      <div className="find-more-people-body">
        {contactList && contactList.length > 0 && (
          <ContactList list={contactList} hasChatEntry={isMainnet} clickItem={clickItem} clickChat={clickChat} />
        )}
        {(!contactList || contactList.length === 0) && <div className="no-data">No Search Result</div>}
      </div>
    </div>
  );
}
