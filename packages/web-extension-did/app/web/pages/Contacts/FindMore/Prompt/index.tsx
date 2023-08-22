import ContactsSearchInput from 'pages/Contacts/components/ContactsSearchInput';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IFindMoreProps } from '..';
import './index.less';
import FindMoreItem from 'pages/Contacts/components/FindMoreItem';

export default function FindMorePrompt({
  headerTitle,
  myPortkeyId,
  contact,
  showChat,
  isAdded,
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
        {contact && contact.name && contact.index && (
          <div className="flex-row-center find-more-body-contact" onClick={clickItem}>
            <FindMoreItem item={contact} isAdded={isAdded} hasChatEntry={showChat} clickChat={clickChat} />
          </div>
        )}
        {!contact && <div className="no-data">No Search Result</div>}
      </div>
    </div>
  );
}
