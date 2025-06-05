import { List } from 'antd-mobile';
import clsx from 'clsx';
import ContactItemSelect, { ISelectItemType } from '../ContactItemSelect';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import './index.less';

interface IContactListSelectProps {
  className?: string;
  list: IContactItemSelectProps[];
  type?: ISelectItemType;
  clickItem: (item: IContactItemSelectProps) => void;
}

export interface IContactItemSelectProps extends Partial<ContactItemType> {
  selected?: boolean;
  disable?: boolean;
}

export default function ContactListSelect({
  className,
  list,
  type = ISelectItemType.CHECKBOX,
  clickItem,
}: IContactListSelectProps) {
  return (
    <List className={clsx(['contact-list-select', className])}>
      {list.map((item, index) => (
        <List.Item key={`ContactListSelect_${index}`} onClick={() => clickItem(item)}>
          <ContactItemSelect item={item} selected={!!item?.selected} disable={item.disable} type={type} />
        </List.Item>
      ))}
    </List>
  );
}
