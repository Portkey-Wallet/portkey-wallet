import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import UnReadBadge from 'pages/components/UnReadBadge';
import './index.less';
import { useIndexAndName } from '@portkey-wallet/hooks/hooks-ca/contact';

export interface IContactItemProps {
  item: Partial<ContactItemType>;
  hasChatEntry?: boolean;
  clickChat?: (e: any, item: Partial<ContactItemType>) => void;
}

export default function ContactItem({ item, hasChatEntry = true, clickChat }: IContactItemProps) {
  const { name, index } = useIndexAndName(item);

  return (
    <div className="flex-between-center contact-item">
      <div className="flex-center contact-item-right">
        <div className="flex-center contact-index-logo-wrap">
          <div className="flex-center contact-index-logo">{index}</div>
          {item.isImputation && <UnReadBadge />}
        </div>
        <span className="contact-item-name">{name}</span>
      </div>
      {hasChatEntry && item?.imInfo?.relationId && (
        <div className="flex-center contact-item-left" onClick={(e) => clickChat?.(e, item)}>
          {`Chat`}
        </div>
      )}
    </div>
  );
}
