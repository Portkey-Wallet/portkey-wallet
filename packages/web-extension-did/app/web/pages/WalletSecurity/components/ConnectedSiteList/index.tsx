import { useTranslation } from 'react-i18next';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { Button } from 'antd';
import { useMemo } from 'react';
import ImgLoading from 'components/ImgLoading';
import './index.less';

export interface IConnectedSiteListProps {
  list: DappStoreItem[];
  onDisconnect: (item: DappStoreItem) => void;
}

export default function ConnectedSiteList({ list, onDisconnect }: IConnectedSiteListProps) {
  const { t } = useTranslation();

  const renderList = useMemo(
    () => (
      <div className="connected-site-list">
        {list.map((item) => (
          <div className="connected-site-item flex-between-center" key={item.origin}>
            <div className="content flex">
              <ImgLoading
                className="icon"
                src={item.icon}
                loadEle={item?.name?.[0] || ''}
                errorEle={item?.name?.[0] || ''}
              />
              <div className="desc">
                <div className="text name">{item.name}</div>
                <div className="text origin">{item.origin}</div>
              </div>
            </div>
            <Button type="text" onClick={() => onDisconnect(item)}>
              {t('Disconnect')}
            </Button>
          </div>
        ))}
      </div>
    ),
    [list, onDisconnect, t],
  );

  return list.length === 0 ? <div className="no-data flex-center">{t('No Connected Sites')}</div> : renderList;
}
