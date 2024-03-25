import ContactsSearchInput from 'pages/Contacts/components/ContactsSearchInput';
import { IFindMoreProps } from '..';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import './index.less';
import FindMoreItem from 'pages/Contacts/components/FindMoreItem';
import Copy from 'components/Copy';
import InviteGuideList from 'pages/components/InviteGuideList';
import OfficialGroupGuide from 'pages/components/OfficialGroupGuide';

export default function FindMorePopup({
  headerTitle,
  myPortkeyId,
  contacts,
  showChat,
  isSearch,
  goBack,
  handleSearch,
  clickItem,
  clickChat,
  clickQRCode,
}: IFindMoreProps) {
  return (
    <div className="find-more-popup min-width-max-height flex-column">
      <div className="flex-column find-more-top">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
        <ContactsSearchInput placeholder="Address/Portkey ID/email" handleChange={handleSearch} />
        {!isSearch && (
          <div className="flex-column">
            <div className="find-more-id flex-between">
              <div className="my-portkey-id">
                <div className="portkey-id-label">My Portkey ID:</div>
                <div className="portkey-id-show">{myPortkeyId}</div>
              </div>
              <div className="show-icon flex">
                <Copy iconType="Copy4" toCopy={myPortkeyId} />
                <CustomSvg type="QRCode2" onClick={clickQRCode} />
              </div>
            </div>
          </div>
        )}
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
