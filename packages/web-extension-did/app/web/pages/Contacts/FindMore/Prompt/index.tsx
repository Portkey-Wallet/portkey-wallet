import ContactsSearchInput from 'pages/Contacts/components/ContactsSearchInput';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IFindMoreProps } from '..';
import ContactList from 'pages/Contacts/components/ContactList';
import './index.less';

export default function FindMorePrompt({
  headerTitle,
  myPortkeyId,
  contactList,
  isMainnet,
  goBack,
  handleSearch,
  clickItem,
  clickChat,
}: IFindMoreProps) {
  return (
    <div className="find-more-prompt">
      <div className="flex-column find-more-top">
        <SecondPageHeader className="find-more-header" paddingLeft={12} title={headerTitle} leftCallBack={goBack} />
        <ContactsSearchInput
          className="find-more-search"
          placeholder="Portkey ID/Address"
          handleChange={handleSearch}
        />
        <div className="find-more-id">My Portkey ID: {myPortkeyId}</div>
      </div>
      <div className="find-more-body">
        {contactList && contactList.length > 0 && (
          <ContactList list={contactList} hasChatEntry={isMainnet} clickItem={clickItem} clickChat={clickChat} />
        )}
        {(!contactList || contactList.length === 0) && <div className="no-data">No Search Result</div>}
      </div>
    </div>
  );
}
