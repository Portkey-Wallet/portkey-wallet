import { useIndexAndName } from '@portkey-wallet/hooks/hooks-ca/contact';
import './index.less';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import CustomSvg from 'components/CustomSvg';
import clsx from 'clsx';

interface IContactItemSelectProps {
  item: ContactItemType;
  selected: boolean;
  disable?: boolean;
}

export default function ContactItemSelect({ item, selected, disable = true }: IContactItemSelectProps) {
  const { name, index } = useIndexAndName(item);

  return (
    <div className={clsx(['flex-between-center', 'contact-item-select', disable && 'im-disable'])}>
      <div className="flex-center contact-item-left">
        <div className="flex-center contact-index-logo">{index}</div>
        <span className="contact-item-name">{name}</span>
      </div>
      <div className="flex-center contact-item-right">
        {selected ? (
          <CustomSvg type="Selected2" className="selected-icon" />
        ) : (
          <CustomSvg type="NotSelected" className="not-selected-icon" />
        )}
      </div>
    </div>
  );
}
