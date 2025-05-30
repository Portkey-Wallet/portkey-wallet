import { useIndexAndName } from '@portkey-wallet/hooks/hooks-ca/contact';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
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
import { useNavigateState } from 'hooks/router';
import Avatar from 'pages/components/Avatar';
import { useCallback, useMemo } from 'react';
import { TRecentDetailLocationState } from 'types/router';

export interface IContactCardProps {
  chainId: ChainId;
  user: RecentContactItemType | ContactItemType;
  onChange: (account: IClickAddressProps) => void;
  fromRecents?: boolean;
  className?: string;
}
export default function ContactCard({ user, className, fromRecents = true, chainId, onChange }: IContactCardProps) {
  const isMainnet = useIsMainnet();
  const isDisabled = useCallback(
    (transactionTime: string | undefined): boolean => {
      return fromRecents && !transactionTime;
    },
    [fromRecents],
  );
  const { name: transName, index: transIndex } = useIndexAndName(user);
  const header = useMemo(
    () => (
      <div className="header">
        <Avatar avatarUrl={user?.avatar} nameIndex={transIndex} size="small" />
        <p>{transName}</p>
      </div>
    ),
    [transIndex, transName, user.avatar],
  );

  const navigate = useNavigateState<TRecentDetailLocationState>();
  const goRecentDetail = (targetAddress: string, targetChainId: ChainId) => {
    navigate('/recent-detail', {
      state: {
        chainId: chainId,
        targetAddress,
        targetChainId,
        name: transName,
        index: transIndex,
        avatar: user?.avatar,
      },
    });
  };

  const formatAddressShow = useCallback(
    (address: string, chainId: string) => `ELF_${formatStr2EllipsisStr(address, [6, 6])}_${chainId}`,
    [],
  );

  return (
    <Collapse key={user.id} className={clsx('contact-card', className)}>
      <Collapse.Panel header={header} key={user.id}>
        <div className="content">
          {user?.addresses?.map((address: RecentAddressItem) => (
            <div
              key={formatAddressShow(address.address, address.chainId)}
              className={clsx(['flex-between-center', 'content-item'])}>
              <div
                className={clsx(['main-info', isDisabled(address?.transactionTime) && 'disabled'])}
                onClick={() =>
                  onChange({ ...address, name: transName, isDisable: isDisabled(address?.transactionTime) })
                }>
                <span className={'address'}>{formatAddressShow(address.address, address.chainId)}</span>
                <span className={clsx(['network', isDisabled(address?.transactionTime) ? 'disabled' : ''])}>
                  {transNetworkText(address.chainId, !isMainnet)}
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
