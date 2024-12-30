import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './index.less';
import { useContactNetworkConfig } from '@portkey-wallet/hooks/hooks-ca/config';
import { IContactSupportNetworkItem } from '@portkey-wallet/types/types-ca/config';
import { useEffectOnce } from '@portkey-wallet/hooks';

export interface INetworkSelectProps {
  onClose: () => void;
  onChange: (v: string) => void;
}

export default function NetworkSelect({ onClose, onChange }: INetworkSelectProps) {
  const { t } = useTranslation();
  const [filterWord, setFilterWord] = useState<string>('');
  const [showNetworkLists, setShowNetworkLists] = useState<IContactSupportNetworkItem[]>([]);

  const { supportNetworkList, fetchContactSupportConfig } = useContactNetworkConfig();

  useEffect(() => {
    if (!filterWord) {
      setShowNetworkLists(supportNetworkList || []);
    } else {
      const filter = (supportNetworkList || []).filter((l) => l.name.toLowerCase() === filterWord.toLowerCase());
      setShowNetworkLists(filter);
    }
  }, [filterWord, showNetworkLists, supportNetworkList]);

  useEffectOnce(() => {
    fetchContactSupportConfig();
  });

  return (
    <div className="network-select">
      <div className="header">
        <p>{t('Select Network')}</p>
        <CustomSvg type="SuggestClose" onClick={onClose} />
      </div>
      <DropdownSearch
        overlayClassName="switch-network-empty-dropdown"
        open={false}
        overlay={<></>}
        inputProps={{
          onChange: (e) => {
            const _value = e.target.value;
            setFilterWord(_value);
          },
          placeholder: t('Search Network'),
        }}
      />
      <div className="list">
        {showNetworkLists.map((net) => (
          <div
            className="item"
            key={`${net.network}_${net.chainId}`}
            onClick={() => {
              onChange?.(net?.network);
              onClose?.();
            }}>
            <img src={net.imageUrl} />
            <span>{net?.name}</span>
          </div>
        ))}
        {!!filterWord && !showNetworkLists.length && (
          <div className="flex-center no-search-result">{t('There is no search result.')}</div>
        )}
      </div>
    </div>
  );
}
