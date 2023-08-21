import { ContactIndexType, ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { IndexBar } from 'antd-mobile';
import './index.less';
import ContactList from '../ContactList';

export interface IContactListIndexBarProps {
  list: ContactIndexType[];
  isSearch: boolean;
  hasChatEntry?: boolean;
  clickItem: (item: ContactItemType) => void;
  clickChat: (e: any, item: Partial<ContactItemType>) => void;
}

export default function ContactListIndexBar({
  list,
  isSearch,
  hasChatEntry,
  clickItem,
  clickChat,
}: IContactListIndexBarProps) {
  return (
    <IndexBar className="contact-list">
      {list.map(({ index, contacts }) => {
        return (
          <IndexBar.Panel
            className={!contacts.length && isSearch ? 'contact-empty' : ''}
            index={index}
            title={index}
            key={index}>
            <ContactList list={contacts} hasChatEntry={hasChatEntry} clickItem={clickItem} clickChat={clickChat} />
          </IndexBar.Panel>
        );
      })}
    </IndexBar>
  );
}
