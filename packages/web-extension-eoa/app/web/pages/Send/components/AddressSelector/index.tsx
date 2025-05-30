import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { ChainId } from '@portkey-wallet/types';
import { IClickAddressProps } from '@portkey-wallet/types/types-ca/contact';
import { Tabs } from 'antd';

import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';
import Contacts from './Contacts';
import './index.less';
import Recents from './Recents';
import MyAddress from './MyAddress';

export default function AddressSelector({
  onClick,
  chainId,
}: {
  onClick: (account: IClickAddressProps) => void;
  chainId: ChainId;
}) {
  const dispatch = useAppCommonDispatch();

  const { t } = useTranslation();
  useEffectOnce(() => {
    // refetch();
    dispatch(fetchContactListAsync());
  });

  return (
    <Tabs
      className="address-selector"
      items={[
        {
          label: t('Recents'),
          key: 'recents',
          children: <Recents onChange={onClick} chainId={chainId} />,
        },
        {
          label: t('Contacts'),
          key: 'contracts',
          children: <Contacts onChange={onClick} chainId={chainId} />,
        },
        {
          label: t('My address'),
          key: 'myAddress',
          children: <MyAddress onClick={onClick} chainId={chainId} />,
        },
      ]}
    />
  );
}
