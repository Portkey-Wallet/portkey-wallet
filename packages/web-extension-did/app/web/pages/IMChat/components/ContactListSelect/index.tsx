import { List } from 'antd-mobile';
import clsx from 'clsx';
import ContactItemSelect from '../ContactItemSelect';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import './index.less';

interface IContactListSelectProps {
  className?: string;
  list: IContactItemSelectProps[];
  clickItem: (item: IContactItemSelectProps) => void;
}

export interface IContactItemSelectProps extends ContactItemType {
  selected?: boolean;
  disable?: boolean;
}

export default function ContactListSelect({ className, list, clickItem }: IContactListSelectProps) {
  return (
    <List className={clsx(['contact-list-select', className])}>
      {list.map((item) => (
        <List.Item key={`${item.id}_${item.name}`} onClick={() => clickItem(item)}>
          <ContactItemSelect item={item} selected={!!item?.selected} disable={item.disable} />
        </List.Item>
      ))}
    </List>
  );
}
