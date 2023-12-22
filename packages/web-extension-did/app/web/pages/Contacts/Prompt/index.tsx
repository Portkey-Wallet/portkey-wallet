import { IContactsProps } from '..';
import ContactsBody from '../components/ContactsBody';
import './index.less';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import AddContactButton from '../components/AddContactButton';
import { Outlet } from 'react-router';
import ContactsSearchInput from '../components/ContactsSearchInput';
import ImputationTip from '../components/ImputationTip';

export default function ContactsPrompt({
  headerTitle,
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
  changeTab,
}: IContactsProps) {
  return (
    <div className="flex contacts-prompt">
      <div className="flex-column contacts-frame">
        <div className="flex-column contacts-title">
          <SecondPageHeader
            className="contacts-header"
            paddingLeft={12}
            title={headerTitle}
            leftElement={false}
            rightElement={
              (contactCount !== 0 || (contactCount === 0 && isSearch)) && (
                <AddContactButton addText={addText} onAdd={handleAdd} isClosed={false} />
              )
            }
          />
          <ContactsSearchInput
            placeholder={searchPlaceholder}
            handleChange={handleSearch}
            className={'search-input-prompt'}
          />
        </div>
        {showImputation && <ImputationTip closeTip={closeImputationTip} />}
        <ContactsBody
          isSearch={isSearch}
          list={list}
          contactCount={contactCount}
          initData={initData}
          changeTab={changeTab}
        />
      </div>
      <Outlet />
    </div>
  );
}
