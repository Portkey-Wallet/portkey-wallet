import { List } from 'antd-mobile';
import type { ListProps } from 'antd-mobile/es/components/list';
import type { ListItemProps } from 'antd-mobile/es/components/list/list-item';

import ContactItem from '../ContactItem';
import './index.less';
import clsx from 'clsx';
import { IContactItemType } from '@portkey-wallet/types/types-eoa/contact';

export interface IContactListProps {
  className?: string;
  list: IContactItemType[];
  clickItem: (item: IContactItemType) => void;
}

const AntList = List as React.FC<ListProps>;
const ListItem = List.Item as React.FC<ListItemProps>;

export default function ContactList({ className, list, clickItem }: IContactListProps) {
  return (
    <AntList className={clsx(['contact-list', className])}>
      {list.map((item) => (
        <ListItem key={`${item.id}_${item.name}`} onClick={() => clickItem(item)}>
          <ContactItem item={item} />
        </ListItem>
      ))}
    </AntList>
  );
}
