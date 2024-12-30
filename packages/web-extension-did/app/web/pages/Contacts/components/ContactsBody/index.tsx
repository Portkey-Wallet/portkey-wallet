import clsx from 'clsx';
import ContactListIndexBar from '../ContactListIndexBar';
import NoContacts from '../NoContacts';
import { IContactIndexType } from '@portkey-wallet/types/types-ca/contactNew';
import { useMemo } from 'react';
import { useGoProfile } from 'hooks/useProfile';
import './index.less';

export interface IContactsBodyProps {
  isSearch: boolean;
  list: IContactIndexType[];
  contactCount: number;
}

export default function ContactsBody({ isSearch, list, contactCount }: IContactsBodyProps) {
  // const { t } = useTranslation();
  // const navigate = useNavigate();

  const handleGoProfile = useGoProfile();

  const allContactListUI = useMemo(() => {
    return (
      <>
        {contactCount === 0 ? (
          isSearch ? (
            <div className="flex-center no-search-result">There is no search result.</div>
          ) : (
            <NoContacts />
          )
        ) : (
          <ContactListIndexBar
            list={list}
            clickItem={(item) => handleGoProfile({ ...item, previousPage: 'contact-list' })}
          />
        )}
      </>
    );
  }, [contactCount, handleGoProfile, isSearch, list]);

  return <div className={clsx(['contacts-body', isSearch && 'index-bar-hidden'])}>{allContactListUI}</div>;
}
