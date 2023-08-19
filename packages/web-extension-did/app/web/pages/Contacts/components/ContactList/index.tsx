import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { List } from 'antd-mobile';
import ContactItem from '../ContactItem';
import './index.less';

export interface IContactListProps {
  list: ContactItemType[];
  hasChatEntry?: boolean;
  clickItem: (item: ContactItemType) => void;
  clickChat: (e: any, item: ContactItemType) => void;
}

export default function ContactList({ list, hasChatEntry, clickItem, clickChat }: IContactListProps) {
  return (
    <List className="contact-list">
      {list.map((item) => (
        <List.Item key={`${item.id}_${item.name}`} onClick={() => clickItem(item)}>
          <ContactItem item={item} hasChatEntry={hasChatEntry} clickChat={clickChat} />
        </List.Item>
      ))}
    </List>
  );
}
