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
          title={headerTitle}
          onLeftBack={goBack}
          rightElementList={[
            {
              customSvgType: 'SuggestAdd',
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
