import ContactsSearchInput from 'pages/Contacts/components/ContactsSearchInput';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IFindMoreProps } from '..';
import './index.less';
import FindMoreItem from 'pages/Contacts/components/FindMoreItem';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import InviteGuideList from 'pages/components/InviteGuideList';

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
  clickQRCode,
}: IFindMoreProps) {
  return (
    <div className="find-more-prompt">
      <div className="flex-column find-more-top">
        <SecondPageHeader className="find-more-header" paddingLeft={24} title={headerTitle} leftCallBack={goBack} />
        <ContactsSearchInput
          className="find-more-search"
          placeholder="Address/Portkey ID/email"
          handleChange={handleSearch}
        />
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
            <InviteGuideList />
          </div>
        )}
      </div>
      <div className="find-more-body">
        {(!contacts || !Array.isArray(contacts) || contacts?.length === 0) && isSearch && (
          <div className="flex-center no-search-result">No Search Result</div>
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
