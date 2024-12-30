import clsx from 'clsx';
import ContactListIndexBar from '../ContactListIndexBar';
import NoContacts from '../NoContacts';
import { useNavigate } from 'react-router';
import { IContactIndexType, IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
import CustomSvg from 'components/CustomSvg';
import { useGoProfile, useProfileChat } from 'hooks/useProfile';
import ContactList from '../ContactList';
import './index.less';

export interface IContactsBodyProps {
  isSearch: boolean;
  list: IContactIndexType[];
  contactCount: number;
}

export default function ContactsBody({ isSearch, list, contactCount }: IContactsBodyProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const flatList = useMemo(() => {
    const transList: IContactItemType[] = [];
    list.forEach(({ contacts }) => {
      transList.push(...contacts);
    });
    return transList;
  }, [list]);

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
