import ContactsSearchInput from 'pages/Contacts/components/ContactsSearchInput';
import { IFindMoreProps } from '..';
import CommonHeader from 'components/CommonHeader';
import './index.less';
import FindMoreItem from 'pages/Contacts/components/FindMoreItem';
import InviteGuideList from 'pages/components/InviteGuideList';
import OfficialGroupGuide from 'pages/components/OfficialGroupGuide';

export default function FindMorePopup({
  headerTitle,
  contacts,
  showChat,
  isSearch,
  goBack,
  handleSearch,
  clickItem,
  clickChat,
}: IFindMoreProps) {
  return (
    <div className="find-more-popup min-width-max-height flex-column">
      <div className="flex-column find-more-top">
        <CommonHeader title={headerTitle} onLeftBack={goBack} />
        <ContactsSearchInput placeholder="Address/email" handleChange={handleSearch} />
      </div>
      <div className="find-more-body">
        {(!contacts || !Array.isArray(contacts) || contacts?.length === 0) && isSearch && (
          <div className="flex-center no-search-result">No Search Result</div>
        )}
        {(!contacts || !Array.isArray(contacts) || contacts?.length === 0) && !isSearch && (
          <div className="flex-column">
            <InviteGuideList />
            <OfficialGroupGuide />
          </div>
        )}
        {Array.isArray(contacts) &&
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
