import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { ChainId } from '@portkey-wallet/types';
import { IClickAddressProps } from '@portkey-wallet/types/types-ca/contact';

// import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';
import Contacts from './Contacts';
import './index.less';
import Recents from './Recents';
import MyAddress from './MyAddress';
import { useMemo, useState } from 'react';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';

const tabs = ['Recents', 'Contacts', 'My address'];

export default function AddressSelector({
  isFt,
  onClick,
  chainId,
  tokenId,
}: {
  isFt: boolean;
  onClick: (account: IClickAddressProps) => void;
  chainId: ChainId;
  tokenId: string;
}) {
  const dispatch = useAppCommonDispatch();

  const caAddressInfos = useCaAddressInfoList();
  const anotherChainId = useMemo(
    () => caAddressInfos.filter((item) => item.chainId !== chainId)?.[0]?.chainId,
    [caAddressInfos, chainId],
  );

  // const { t } = useTranslation();
  useEffectOnce(() => {
    // refetch();
    dispatch(fetchContactListAsync());
  });

  const [tabIndex, setTabIndex] = useState(0);

  const changeTab = (index: number) => {
    setTabIndex(index);
  };

  return (
    <div className="address-selector">
      <div className="tab-list">
        {tabs.map((list, index) => {
          return (
            <button className={tabIndex == index ? 'active-tab' : ''} onClick={() => changeTab(index)} key={list}>
              {list}
            </button>
          );
        })}
      </div>
      <div>
        {tabIndex == 0 && <Recents isFt={isFt} onChange={onClick} chainId={chainId} tokenId={tokenId} />}
        {tabIndex == 1 && <Contacts fromChainId={chainId} tokenId={tokenId} onChange={onClick} isFt={isFt} />}
        {tabIndex == 2 && <MyAddress onClick={onClick} chainId={anotherChainId} />}
      </div>
    </div>
  );

  // return (
  //   <Tabs
  //     className="address-selector"
  //     items={[
  //       {
  //         label: t('Recents'),
  //         key: 'recents',
  //         children: <Recents isFt={isFt} onChange={onClick} chainId={chainId} tokenId={tokenId} />,
  //       },
  //       {
  //         label: t('Contacts'),
  //         key: 'contracts',
  //         children: <Contacts onChange={onClick} chainId={chainId} />,
  //       },
  //       {
  //         label: t('My address'),
  //         key: 'myAddress',
  //         children: <MyAddress onClick={onClick} chainId={chainId} />,
  //       },
  //     ]}
  //   />
  // );
}
