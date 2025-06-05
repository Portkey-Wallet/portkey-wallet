import { IContactIndexType, IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import { IndexBar } from 'antd-mobile';
import './index.less';
import ContactList from '../ContactList';

export interface IContactListIndexBarProps {
  list: IContactIndexType[];
  clickItem: (item: IContactItemType) => void;
}

export default function ContactListIndexBar({ list, clickItem }: IContactListIndexBarProps) {
  return (
    <IndexBar className="contact-list">
      {list.map(({ index, contacts }) => {
        return (
          <IndexBar.Panel className={!contacts.length ? 'contact-empty' : ''} index={index} title={index} key={index}>
            <ContactList list={contacts} clickItem={clickItem} />
          </IndexBar.Panel>
        );
      })}
    </IndexBar>
  );
}
