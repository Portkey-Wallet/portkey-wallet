import { IContactItemRes } from 'pages/Contacts/FindMore';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import Avatar from 'pages/components/Avatar';

export interface IContactItemProps {
  item: IContactItemRes;
  hasChatEntry?: boolean;
  clickChat?: (e: any, item: IContactItemRes) => void;
}

export default function FindMoreItem({ item, hasChatEntry = true, clickChat }: IContactItemProps) {
  return (
    <div className="flex-between-center find-more-item">
      <div className="flex-center find-more-item-right">
        <Avatar
          avatarUrl={item?.avatar || ''}
          nameIndex={item?.index || ''}
          size="small"
          wrapperClass="find-more-index-logo"
        />
        <div>
          <span className="find-more-item-name">{item.name}</span>
          {item.isAdded && (
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
