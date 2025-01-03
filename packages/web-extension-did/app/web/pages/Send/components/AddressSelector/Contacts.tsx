// import { IndexBar, List } from 'antd-mobile';
import clsx from 'clsx';
import { useState } from 'react';
import './index.less';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import { CustomSvgV3 } from 'components/CustomSvgV3';

// import { useAelfContactList } from '@portkey-wallet/hooks/hooks-ca/contact';
// import ContactCard from './ContactCard';
import { useTranslation } from 'react-i18next';
import { ChainId } from '@portkey-wallet/types';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';

import { useGetFilterContactList } from '@portkey-wallet/hooks/hooks-ca/contactNew';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import { useNavigate } from 'react-router';

export const ContactListItem = ({
  item,
  onChange,
}: {
  item: IContactItemType;
  onChange: (account: IContactItemType) => void;
}) => {
  const navigate = useNavigate();

  const goRecentDetail = (item: IContactItemType) => {
    navigate('/recent-detail', { state: { ...item, isFromSend: true } });
  };

  console.log('ContactListItem', item);
  return (
    <div className="contact-list" onClick={() => onChange(item)}>
      {item?.addressInfo?.network === 'aelf' ? (
        <>
          <TokenImageDisplay
            src={item?.caHolderInfo?.avatar}
            subDisplay={true}
            chain={item?.addressInfo?.chainId === 'AELF' ? 'main' : 'dApp'}
          />
          <div className="info-box">
            <div className="name">{item.name || item?.caHolderInfo?.walletName}</div>
            <div className="address">
              {formatStr2EllipsisStr(`ELF_${item?.addressInfo?.address}_${item.addressInfo?.chainId}`)}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="chain-box">
            <TokenImageDisplay className="show-name" symbol={item?.name} subDisplay={false} />
            <TokenImageDisplay className="chain-logo" src={item?.addressInfo.networkImage} subDisplay={false} />
          </div>
          <div className="info-box">
            <div className="name">{item?.caHolderInfo?.walletName}</div>
            <div className="address">{formatStr2EllipsisStr(item?.addressInfo?.address)}</div>
          </div>
        </>
      )}
      <div className="info-icon" onClick={() => goRecentDetail(item)}>
        <CustomSvgV3 type="info" className="info-icon" />
      </div>
    </div>
  );
};

export default function Contacts({
  fromChainId,
  tokenId,
  isFt,
  onChange,
}: {
  fromChainId: ChainId;
  tokenId: string;
  isFt: boolean;
  onChange: (account: IContactItemType) => void;
}) {
  const { t } = useTranslation();

  const [list, setList] = useState<IContactItemType[]>([]);

  const getSavedList = useGetFilterContactList();

  useEffectOnce(() => {
    const _list = getSavedList({ fromChainId, tokenId, isFt });
    console.log('getSavedList', _list);
    setList(_list);
  });

  return (
    <div className="contacts">
      <div className={clsx(['contacts-body', 'index-bar-hidden'])}>
        {list.length === 0 ? (
          <p className="no-data">{t('There is no contacts')}</p>
        ) : (
          <div>
            {list.map((item: IContactItemType, index) => (
              <ContactListItem key={index} item={item} onChange={onChange} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
