import BackHeader from 'components/BackHeader';
import { IContactsProps } from '..';
import AddContactButton from '../components/AddContactButton';
import ContactsBody from '../components/ContactsBody';
import ContactsSearchInput from '../components/ContactsSearchInput';
import './index.less';
import ImputationTip from '../components/ImputationTip';

export default function ContactsPopup({
  headerTitle,
  goBack,
  searchPlaceholder,
  addText,
  handleAdd,
  isSearch,
  handleSearch,
  list,
  contactCount,
  initData,
  showImputation = false,
  closeImputationTip,
}: IContactsProps) {
  return (
    <div className="flex-column contacts-popup min-width-max-height">
      <div className="flex-column contacts-title">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={
            (contactCount !== 0 || (contactCount === 0 && isSearch)) && (
              <AddContactButton addText={addText} goBack={goBack} onAdd={handleAdd} isClosed />
            )
          }
        />
        <ContactsSearchInput placeholder={searchPlaceholder} handleChange={handleSearch} />
      </div>
      {showImputation && <ImputationTip closeTip={closeImputationTip} />}
      <ContactsBody
        isSearch={isSearch}
        list={list}
        contactCount={contactCount}
        initData={initData}
        portkeyChatCount={0}
        portkeyChatInitData={initData}
        portkeyChatList={[]}
        isSearchPortkeyChat={false}
      />
    </div>
  );
}
