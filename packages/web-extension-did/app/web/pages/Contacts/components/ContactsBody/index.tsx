import clsx from 'clsx';
import ContactList from '../ContactList';
import NoContacts from '../NoContacts';
import { useNavigate } from 'react-router';
import { ContactIndexType, ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import './index.less';

export interface IContactsBodyProps {
  isSearch: boolean;
  list: ContactIndexType[];
  contactCount: number;
  initData: Partial<ContactItemType>;
}

export default function ContactsBody({ isSearch, list, contactCount, initData }: IContactsBodyProps) {
  const navigate = useNavigate();

  return (
    <div className={clsx(['contacts-body', isSearch && 'index-bar-hidden'])}>
      {contactCount === 0 ? (
        isSearch ? (
          <div className="flex-center no-search-result">There is no search result.</div>
        ) : (
          <NoContacts initData={initData} />
        )
      ) : (
        <ContactList
          list={list}
          isSearch={isSearch}
          clickItem={(item, index) => {
            navigate('/setting/contacts/view', { state: { ...item, index: index } });
          }}
        />
      )}
    </div>
  );
}
