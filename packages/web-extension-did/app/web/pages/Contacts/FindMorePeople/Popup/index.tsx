import ContactsSearchInput from 'pages/Contacts/components/ContactsSearchInput';
import { IFindMorePeopleProps } from '..';
import ContactList from 'pages/Contacts/components/ContactList';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import './index.less';

export default function FindMorePeoplePopup({
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
    <div className="find-more-people-popup min-width-max-height">
      <div className="flex-column find-more-people-top">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
        <ContactsSearchInput placeholder="Portkey ID/Address" handleChange={handleSearch} />
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
