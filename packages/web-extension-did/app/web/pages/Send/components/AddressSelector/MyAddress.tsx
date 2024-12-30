import { ChainId } from '@portkey-wallet/types';
import { IClickAddressProps } from '@portkey-wallet/types/types-ca/contact';
import { ICaAddressInfoListItemType, useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useEffect, useState } from 'react';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useTranslation } from 'react-i18next';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';

// import { useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contactNew';

export default function MyAddress({
  chainId,
  onClick,
}: {
  chainId: ChainId;
  onClick: (account: IClickAddressProps) => void;
}) {
  const isMainnet = useIsMainnet();
  const { t } = useTranslation();
  const [addressList, setAddressList] = useState<ICaAddressInfoListItemType[]>([]);
  const caAddressInfos = useCaAddressInfoList();

  const [info] = useState(useCurrentUserInfo());

  useEffect(() => {
    const list = caAddressInfos.filter((item) => item.chainId !== chainId);
    setAddressList(list);
  }, [caAddressInfos, chainId]);

  console.log('addressList', addressList);

  return (
    <div className="my-address">
      {addressList.length === 0 && <p className="no-data">{t('There is no address')}</p>}
      {addressList?.map((item, idx) => {
        const _address = `ELF_${formatStr2EllipsisStr(item.caAddress, [6, 6])}_${item.chainId}`;
        return (
          <div
            className="my-address-item"
            key={idx + _address}
            onClick={() => {
              onClick({ chainId: item.chainId, address: item.caAddress });
            }}>
            <div className="info-box">
              <TokenImageDisplay src={info.avatar} subDisplay={true} chain={item.chainId == 'AELF' ? 'main' : 'dApp'} />
            </div>
            <div className="info-detail">
              <div className="address">{_address}</div>
              <div className="network">{transNetworkText(item.chainId, !isMainnet)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
