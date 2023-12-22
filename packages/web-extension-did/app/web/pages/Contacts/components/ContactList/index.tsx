import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { List } from 'antd-mobile';
import ContactItem from '../ContactItem';
import './index.less';
import clsx from 'clsx';

export interface IContactListProps {
  className?: string;
  list: ContactItemType[];
  hasChatEntry?: boolean;
  clickItem: (item: ContactItemType) => void;
  clickChat?: (e: any, item: Partial<ContactItemType>) => void;
}

export default function ContactList({ className, list, hasChatEntry, clickItem, clickChat }: IContactListProps) {
  return (
    <List className={clsx(['contact-list', className])}>
      {list.map((item) => (
        <List.Item key={`${item.id}_${item.name}`} onClick={() => clickItem(item)}>
          <ContactItem item={item} hasChatEntry={hasChatEntry} clickChat={clickChat} />
        </List.Item>
      ))}
    </List>
  );
}
