import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import './index.less';

export interface IContactItemProps {
  item: Partial<ContactItemType>;
  hasChatEntry?: boolean;
  clickChat?: (e: any, item: Partial<ContactItemType>) => void;
}

export default function ContactItem({ item, hasChatEntry = true, clickChat }: IContactItemProps) {
  return (
    <div className="flex-between contact-item">
      <div className="flex-center contact-item-right">
        <div className="flex-center contact-index-logo">{item.index}</div>
        <span className="contact-item-name">{item?.name || item?.caHolderInfo?.walletName || item?.imInfo?.name}</span>
      </div>
      {hasChatEntry && (
        <div className="flex-center contact-item-left" onClick={(e) => clickChat?.(e, item)}>
          {`Chat`}
        </div>
      )}
    </div>
  );
}
