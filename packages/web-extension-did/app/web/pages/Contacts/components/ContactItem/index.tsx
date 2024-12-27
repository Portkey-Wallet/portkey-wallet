import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import UnReadBadge from 'pages/components/UnReadBadge';
import './index.less';
import { useIndexAndName } from '@portkey-wallet/hooks/hooks-ca/contact';
import Avatar from 'pages/components/Avatar';

export interface IContactItemProps {
  item: Partial<IContactItemType>;
}

export default function ContactItem({ item }: IContactItemProps) {
  const { name, index } = useIndexAndName(item);

  return (
    <div className="flex-between-center contact-item">
      <div className="flex-center contact-item-right">
        <div className="flex-center contact-index-logo-wrap">
          {/* TODO: add chainImg  item.addressInfo?.networkImage */}
          <Avatar
            avatarUrl={item?.caHolderInfo?.avatar || ''}
            nameIndex={index}
            size="small"
            wrapperClass="contact-index-logo"
          />
        </div>
        <div>
          <span className="contact-item-name">{name}</span>
          <span className="contact-item-name">{item.addressInfo?.address}</span>
        </div>
      </div>
    </div>
  );
}
