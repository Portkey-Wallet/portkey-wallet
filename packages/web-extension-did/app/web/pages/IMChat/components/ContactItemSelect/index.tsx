import { useIndexAndName } from '@portkey-wallet/hooks/hooks-ca/contact';
import './index.less';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import CustomSvg from 'components/CustomSvg';
import clsx from 'clsx';
import Avatar from 'pages/components/Avatar';

export enum ISelectItemType {
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
}

interface IContactItemSelectProps {
  item: Partial<ContactItemType>;
  selected: boolean;
  disable?: boolean;
  type?: ISelectItemType;
}

export default function ContactItemSelect({
  item,
  selected,
  disable = false,
  type = ISelectItemType.CHECKBOX,
}: IContactItemSelectProps) {
  const { name, index } = useIndexAndName(item);

  return (
    <div className={clsx(['flex-between-center', 'contact-item-select', disable && 'im-disable'])}>
      <div className="flex-center contact-item-left">
        <Avatar wrapperClass="contact-index-logo" avatarUrl={item?.avatar || ''} nameIndex={index} size="small" />
        <span className="contact-item-name">{name}</span>
      </div>
      <div className="flex-center contact-item-right">
        {type === ISelectItemType.CHECKBOX &&
          (selected ? (
            <CustomSvg type="Selected2" className="selected-icon" />
          ) : (
            <CustomSvg type="NotSelected" className="not-selected-icon" />
          ))}
        {type === ISelectItemType.RADIO && selected && <CustomSvg type="Selected2" className="selected-icon" />}
      </div>
    </div>
  );
}
