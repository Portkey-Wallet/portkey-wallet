import { IContactsProps } from '..';
import ContactsBody from '../components/ContactsBody';
import './index.less';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import AddContactButton from '../components/AddContactButton';
import { Outlet } from 'react-router';
import ContactsSearchInput from '../components/ContactsSearchInput';

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
      <Outlet />
    </div>
  );
}
