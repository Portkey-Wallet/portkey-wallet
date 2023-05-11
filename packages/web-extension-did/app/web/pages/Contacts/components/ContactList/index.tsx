import { ContactIndexType, ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { IndexBar, List } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import './index.less';

export interface IContactListProps {
  list: ContactIndexType[];
  isSearch: boolean;
  clickItem: (item: ContactItemType, index: number | string) => void;
}

export default function ContactList({ list, isSearch, clickItem }: IContactListProps) {
  const { t } = useTranslation();

  return (
    <IndexBar className="contact-list">
      {list.map(({ index, contacts }) => {
        return (
          <IndexBar.Panel
            className={!contacts.length && isSearch ? 'contact-empty' : ''}
            index={index}
            title={index}
            key={index}>
            <List>
              {contacts.map((item) => (
                <List.Item key={`${item.id}_${item.name}`} onClick={() => clickItem(item, index)}>
                  <div className="flex contact-item-content">
                    <div className="flex-center contact-index-logo">{t(index)}</div>
                    <span className="contact-item-name">{item.name}</span>
                  </div>
                </List.Item>
              ))}
            </List>
          </IndexBar.Panel>
        );
      })}
    </IndexBar>
  );
}
