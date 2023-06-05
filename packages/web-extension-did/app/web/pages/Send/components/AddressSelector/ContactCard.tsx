import { ChainId } from '@portkey-wallet/types';
import {
  ContactItemType,
  IClickAddressProps,
  RecentAddressItem,
  RecentContactItemType,
} from '@portkey-wallet/types/types-ca/contact';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import { Collapse } from 'antd';
import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import { useIsTestnet } from 'hooks/useNetwork';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';

export interface IContactCardProps {
  chainId: ChainId;
  user: RecentContactItemType | ContactItemType;
  onChange: (account: IClickAddressProps) => void;
  fromRecents?: boolean;
  className?: string;
}
export default function ContactCard({ user, className, fromRecents = true, chainId, onChange }: IContactCardProps) {
  const isTestnet = useIsTestnet();
  const isDisabled = useCallback(
    (transactionTime: string | undefined): boolean => fromRecents && !transactionTime,
    [fromRecents],
  );
  const header = useMemo(
    () => (
      <div className="header">
        <div className="icon">{user.index || ''}</div>
        <p>{user.name}</p>
      </div>
    ),
    [user.index, user.name],
  );

  const navigate = useNavigate();
  const goRecentDetail = (targetAddress: string, targetChainId: ChainId) => {
    navigate('/recent-detail', {
      state: { chainId: chainId, targetAddress, targetChainId, name: user.name, index: user.index },
    });
  };

  return (
    <Collapse key={user.id} className={clsx('contact-card', className)}>
      <Collapse.Panel header={header} key={user.id}>
        <div className="content">
          {user?.addresses?.map((address: RecentAddressItem) => (
            <div key={address.address} className={clsx(['flex-between-center', 'content-item'])}>
              <div
                className={clsx(['main-info', isDisabled(address?.transactionTime) ? 'disabled' : null])}
                onClick={() =>
                  onChange({ ...address, name: user.name, isDisable: isDisabled(address?.transactionTime) })
                }>
                <span className={'address'}>
                  {`ELF_${formatStr2EllipsisStr(address.address, [6, 6])}_${address.chainId}`}
                </span>
                <span className={clsx(['network', isDisabled(address?.transactionTime) ? 'disabled' : ''])}>
                  {transNetworkText(address.chainId, isTestnet)}
                </span>
              </div>

              <div className="go-detail" onClick={() => goRecentDetail(address.address, address.chainId)}>
                <CustomSvg className="go-detail-icon" type={'Info'} />
              </div>
            </div>
          ))}
        </div>
      </Collapse.Panel>
    </Collapse>
  );
}
