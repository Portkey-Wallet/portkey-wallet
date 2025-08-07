import { ChainId } from '@portkey-wallet/types';
import { IClickAddressProps } from '@portkey-wallet/types/types-ca/contact';
import { useMemo } from 'react';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useTranslation } from 'react-i18next';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import { useChainList } from '@portkey-wallet/hooks/hooks-eoa/network/chain';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { LOCAL_AVATARS } from 'assets/images/avatars/avatars';

export interface IContactItemMyType {
  address: string;
  avatarImg: string;
  network: string;
  isExchange?: boolean;
  chainId: ChainId;
  [key: string]: any;
}

export default function MyAddress({
  chainId,
  onClick,
}: {
  chainId: ChainId;
  onClick: (account: IClickAddressProps) => void;
}) {
  const isMainnet = useIsMainnet();
  const { t } = useTranslation();
  const currentAccount = useCurrentAccount();

  const aelfChainList = useChainList();
  const myAddressesList = useMemo((): IContactItemMyType[] => {
    const chainIdInfo = aelfChainList?.find((ele) => ele.chainId !== chainId);
    console.log(chainIdInfo, chainId, '=====chainIdInfo');

    const myOtherAddress = {
      address: currentAccount?.address || '',
      avatarImg: '',
      network: 'aelf',
      chainId: chainIdInfo?.chainId || 'AELF',
      addressInfo: {
        chainId: chainIdInfo?.chainId || 'AELF',
        network: 'aelf',
        address: currentAccount?.address || '',
      },
    };
    return [myOtherAddress];
  }, [aelfChainList, chainId, currentAccount?.address]);

  return (
    <div className="my-address">
      {myAddressesList.length === 0 && <p className="no-data">{t('There is no address')}</p>}
      {myAddressesList?.map((item, idx) => {
        const _address = `ELF_${formatStr2EllipsisStr(item.address, [6, 6])}_${item.chainId}`;
        return (
          <div
            className="my-address-item"
            key={idx + _address}
            onClick={() => {
              onClick({ chainId: item.chainId, address: item.address });
            }}>
            <div className="info-box">
              <TokenImageDisplay
                src={LOCAL_AVATARS[currentAccount?.icon || 'avatar_1']}
                subDisplay={true}
                chain={item.chainId == 'AELF' ? 'main' : 'dApp'}
              />
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
