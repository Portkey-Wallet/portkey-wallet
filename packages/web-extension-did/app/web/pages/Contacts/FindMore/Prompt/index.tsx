import ContactsSearchInput from 'pages/Contacts/components/ContactsSearchInput';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IFindMoreProps } from '..';
import './index.less';
import FindMoreItem from 'pages/Contacts/components/FindMoreItem';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';

export default function FindMorePrompt({
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
  clickQRCode,
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
        {!isSearch && (
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
        )}
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
