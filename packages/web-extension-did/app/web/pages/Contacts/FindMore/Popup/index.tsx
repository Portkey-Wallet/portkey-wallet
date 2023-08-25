import ContactsSearchInput from 'pages/Contacts/components/ContactsSearchInput';
import { IFindMoreProps } from '..';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import './index.less';
import FindMoreItem from 'pages/Contacts/components/FindMoreItem';

export default function FindMorePopup({
  headerTitle,
  myPortkeyId,
  contact,
  showChat,
  isAdded,
  isSearch,
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
        {!isSearch && <div className="find-more-id">My Portkey ID: {myPortkeyId}</div>}
      </div>
      <div className="find-more-body">
        {(!contact || !contact.name) && isSearch && (
          <div className="flex-center no-search-result">No Search Result</div>
        )}
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
