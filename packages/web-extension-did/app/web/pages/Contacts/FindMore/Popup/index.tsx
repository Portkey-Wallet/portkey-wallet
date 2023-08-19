import ContactsSearchInput from 'pages/Contacts/components/ContactsSearchInput';
import { IFindMoreProps } from '..';
import ContactList from 'pages/Contacts/components/ContactList';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import './index.less';

export default function FindMorePopup({
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
    <div className="find-more-popup min-width-max-height">
      <div className="flex-column find-more-top">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
        <ContactsSearchInput placeholder="Portkey ID/Address" handleChange={handleSearch} />
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
