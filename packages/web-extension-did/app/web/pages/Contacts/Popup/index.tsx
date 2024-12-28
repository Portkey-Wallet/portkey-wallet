import CommonHeader from 'components/CommonHeader';
import { IContactsProps } from '..';
import ContactsBody from '../components/ContactsBody';
import ContactsSearchInput from '../components/ContactsSearchInput';
import './index.less';

export default function ContactsPopup({
  headerTitle,
  goBack,
  searchPlaceholder,
  handleAdd,
  isSearch,
  handleSearch,
  list,
  contactCount,
}: IContactsProps) {
  return (
    <div className="flex-column contacts-popup min-width-max-height">
      <div className="flex-column">
        <CommonHeader
          className="contacts-popup-header"
          title={headerTitle}
          onLeftBack={goBack}
          rightElementList={[
            {
              customSvgType: 'add',
              onClick: handleAdd,
            },
          ]}
        />
        <ContactsSearchInput placeholder={searchPlaceholder} handleChange={handleSearch} />
      </div>
      <ContactsBody isSearch={isSearch} list={list} contactCount={contactCount} />
    </div>
  );
}
