import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import './index.less';
import { useIndexAndName } from '@portkey-wallet/hooks/hooks-ca/contact';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';

export interface IContactItemProps {
  item: Partial<IContactItemType>;
}

export const getShowAddress = (item: any) => {
  if (item.addressInfo.network == 'aelf') {
    return formatStr2EllipsisStr(`ELF_${item.addressInfo.address}_${item.addressInfo.chainId}`);
  }
  return formatStr2EllipsisStr(item.addressInfo.address);
};

export default function ContactItem({ item }: IContactItemProps) {
  const { name, index } = useIndexAndName(item);

  console.log('index', index, item);

  return (
    <div className="flex-between-center contact-item">
      <div className="flex-center contact-item-right">
        <div className="flex-center contact-index-logo-wrap">
          {/* TODO: add chainImg  item.addressInfo?.networkImage */}

          {item?.addressInfo?.network == 'aelf' ? (
            <TokenImageDisplay
              src={item?.caHolderInfo?.avatar}
              size={'medium'}
              subDisplay={true}
              chain={item?.addressInfo?.chainId === 'AELF' ? 'main' : 'dApp'}
            />
          ) : (
            <div className="chain-box">
              {/* <TokenImageDisplay src={item?.addressInfo?.networkImage} size={'medium'} /> */}
              <TokenImageDisplay width={40} className="token-icon" symbol={item?.addressInfo?.networkName} />
              <TokenImageDisplay width={20} className="token-icon chain-logo" src={item?.addressInfo?.networkImage} />
            </div>
          )}
        </div>
        <div className="contact-item-info">
          <span className="contact-item-name">{name}</span>
          <span className="contact-item-address">{getShowAddress(item)}</span>
        </div>
      </div>
    </div>
  );
}
