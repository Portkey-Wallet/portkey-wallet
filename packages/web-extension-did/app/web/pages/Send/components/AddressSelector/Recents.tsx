import { IClickAddressProps } from '@portkey-wallet/types/types-ca/contact';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import RecentItem from './RecentItem';
import { ChainId } from '@portkey-wallet/types';
import { useRecent } from '@portkey-wallet/hooks/hooks-ca/recent';
import { TFormattedRecentItem } from '@portkey-wallet/types/types-ca/contactNew';

export default function Recents({
  onChange,
  chainId,
  tokenId,
  isFt,
}: {
  onChange: (account: IClickAddressProps) => void;
  chainId: ChainId;
  tokenId: string;
  isFt?: boolean;
}) {
  const { t } = useTranslation();
  const [recentList, setRecentList] = useState<TFormattedRecentItem[]>([]);

  const { getTransformedRecentList } = useRecent();

  useEffectOnce(() => {
    const _list = getTransformedRecentList({
      fromChainId: chainId,
      tokenId,
      isFt: !!isFt,
    });
    setRecentList(_list || []);
  });

  return (
    <div className="recents">
      {recentList.map((item: TFormattedRecentItem, index: number) => {
        return <RecentItem item={item} key={index} onClick={onChange} />;
      })}
      {recentList.length === 0 && <p className="no-data">{t('There is no recent')}</p>}
    </div>
  );
}
