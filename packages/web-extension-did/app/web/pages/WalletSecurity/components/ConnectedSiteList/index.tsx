import { useTranslation } from 'react-i18next';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { Button } from 'antd';
import { useCallback, useMemo } from 'react';
import ImageDisplay from 'pages/components/ImageDisplay';
import CustomSvg from 'components/CustomSvg';
import './index.less';

export interface IConnectedSiteListProps {
  list: DappStoreItem[];
  onDisconnect: (item: DappStoreItem) => void;
}

export default function ConnectedSiteList({ list, onDisconnect }: IConnectedSiteListProps) {
  const { t } = useTranslation();
  const isSafeOrigin = useCallback((origin: string) => origin.startsWith('https://'), []);

  const renderList = useMemo(
    () => (
      <div className="connected-site-list">
        {list.map((item) => (
          <div className="connected-site-item flex-between-center" key={item.origin}>
            <div className="content flex">
              <ImageDisplay defaultHeight={32} className="icon" src={item.icon} backupSrc="DappDefault" />
              <div className="desc flex-column">
                <div className="text name">
                  <span className="dapp-name">{item.name}</span>
                  <CustomSvg type={isSafeOrigin(item.origin) ? 'DappLock' : 'DappWarn'} />
                </div>
                <div className="text origin">{item.origin}</div>
              </div>
            </div>
            <div className="btn">
              <Button type="text" onClick={() => onDisconnect(item)}>
                {t('Disconnect')}
              </Button>
            </div>
          </div>
        ))}
      </div>
    ),
    [isSafeOrigin, list, onDisconnect, t],
  );

  return list.length === 0 ? <div className="no-data flex-center">{t('No Connected Sites')}</div> : renderList;
}
