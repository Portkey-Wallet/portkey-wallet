import ContactsSearchInput from 'pages/Contacts/components/ContactsSearchInput';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IFindMoreProps } from '..';
import './index.less';
import FindMoreItem from 'pages/Contacts/components/FindMoreItem';

export default function FindMorePrompt({
  headerTitle,
  myPortkeyId,
  contacts,
  showChat,
  isSearch,
  goBack,
  handleSearch,
  clickItem,
  clickChat,
}: IFindMoreProps) {
  return (
    <div className="find-more-prompt">
      <div className="flex-column find-more-top">
        <SecondPageHeader className="find-more-header" paddingLeft={24} title={headerTitle} leftCallBack={goBack} />
        <ContactsSearchInput
          className="find-more-search"
          placeholder="Address/Portkey ID"
          handleChange={handleSearch}
        />
        {!isSearch && <div className="find-more-id">My Portkey ID1234: {myPortkeyId}</div>}
      </div>
      <div className="find-more-body">
        {(!contacts || contacts?.length === 0) && isSearch && (
          <div className="flex-center no-search-result">No Search Result</div>
        )}
        {contacts &&
          contacts?.length > 0 &&
          contacts.map((contact, idx) => {
            return (
              <div
                className="flex-row-center find-more-body-contact"
                key={`${idx}-${contact.imInfo?.relationId}`}
                onClick={() => clickItem(contact)}>
                <FindMoreItem item={contact} hasChatEntry={showChat} clickChat={clickChat} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
