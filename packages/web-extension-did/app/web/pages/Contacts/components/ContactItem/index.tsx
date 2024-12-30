import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import './index.less';
import { useIndexAndName } from '@portkey-wallet/hooks/hooks-ca/contact';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';

export interface IContactItemProps {
  item: Partial<IContactItemType>;
}

export default function ContactItem({ item }: IContactItemProps) {
  const { name, index } = useIndexAndName(item);

  console.log('index', index);

  return (
    <div className="flex-between-center contact-item">
      <div className="flex-center contact-item-right">
        <div className="flex-center contact-index-logo-wrap">
          {/* TODO: add chainImg  item.addressInfo?.networkImage */}
          <TokenImageDisplay
            src={item?.caHolderInfo?.avatar}
            size={'medium'}
            subDisplay={true}
            chain={item?.addressInfo?.chainId === 'AELF' ? 'main' : 'dApp'}
          />
        </div>
        <div className="contact-item-info">
          <span className="contact-item-name">{name}</span>
          <span className="contact-item-address">{formatStr2EllipsisStr(item.addressInfo?.address)}</span>
        </div>
      </div>
    </div>
  );
}
