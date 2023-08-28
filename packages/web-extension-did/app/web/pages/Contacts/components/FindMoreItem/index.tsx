import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import './index.less';
import CustomSvg from 'components/CustomSvg';

export interface IContactItemProps {
  item: Partial<ContactItemType>;
  isAdded?: boolean;
  hasChatEntry?: boolean;
  clickChat?: (e: any, item: Partial<ContactItemType>) => void;
}

export default function FindMoreItem({ item, isAdded = false, hasChatEntry = true, clickChat }: IContactItemProps) {
  return (
    <div className="flex-between-center find-more-item">
      <div className="flex-center find-more-item-right">
        <div className="flex-center find-more-index-logo">{item.index}</div>
        <div>
          <span className="find-more-item-name">{item.name}</span>
          {isAdded && (
            <div className="flex action-item added-contact">
              <CustomSvg type="ContactAddedBlue" />
              <span>{`Contact`}</span>
            </div>
          )}
        </div>
      </div>
      {hasChatEntry && (
        <div className="flex-center find-more-item-left" onClick={(e) => clickChat?.(e, item)}>
          {`Chat`}
        </div>
      )}
    </div>
  );
}
