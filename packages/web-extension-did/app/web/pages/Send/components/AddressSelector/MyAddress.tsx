import { ChainId } from '@portkey-wallet/types';
import { IClickAddressProps } from '@portkey-wallet/types/types-ca/contact';
import { ICaAddressInfoListItemType, useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useEffect, useState } from 'react';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsTestnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useTranslation } from 'react-i18next';

export default function MyAddress({
  chainId,
  onClick,
}: {
  chainId: ChainId;
  onClick: (account: IClickAddressProps) => void;
}) {
  const isTestNet = useIsTestnet();
  const { t } = useTranslation();
  const [addressList, setAddressList] = useState<ICaAddressInfoListItemType[]>([]);
  const caAddressInfos = useCaAddressInfoList();

  useEffect(() => {
    const list = caAddressInfos.filter((item) => item.chainId !== chainId);
    setAddressList(list);
  }, [caAddressInfos, chainId]);

  return (
    <div className="my-address">
      {addressList.length === 0 && <p className="no-data">{t('There is no address')}</p>}
      {addressList?.map((item, idx) => {
        return (
          <div
            className="my-address-item"
            key={idx + item.caAddress}
            onClick={() => {
              onClick({ chainId: item.chainId, address: item.caAddress });
            }}>
            <p className="address">{`ELF_${formatStr2EllipsisStr(item.caAddress, [6, 6])}_${item.chainId}`}</p>
            <p className="network">{transNetworkText(item.chainId, isTestNet)}</p>
          </div>
        );
      })}
    </div>
  );
}
