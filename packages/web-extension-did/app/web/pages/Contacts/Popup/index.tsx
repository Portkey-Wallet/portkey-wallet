import BackHeader from 'components/BackHeader';
import { IContactsProps } from '..';
import AddContactButton from '../components/AddContactButton';
import ContactsBody from '../components/ContactsBody';
import ContactsSearchInput from '../components/ContactsSearchInput';
import './index.less';

export default function ContactsPopup({
  headerTitle,
  goBack,
  addText,
  handleAdd,
  isSearch,
  handleSearch,
  list,
  contactCount,
  initData,
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
        <ContactsSearchInput handleChange={handleSearch} />
      </div>
      <ContactsBody isSearch={isSearch} list={list} contactCount={contactCount} initData={initData} />
    </div>
  );
}
