import { useRef } from 'react';
import CommonHeader from 'components/CommonHeader';
import CustomSvg from 'components/CustomSvg';
import Avatar from '../Avatar';
import AccountConnect from '../AccountConnect';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import UnReadBadge from '../UnReadBadge';
import CopyAddressDrawerOrModal, { CopyAddressDrawerOrModalInstance } from '../CopyAddressDrawerOrModal';
import './index.less';

export interface IHomeHeaderProps {
  onUserClick?: (e?: any) => void;
  unReadShow?: boolean;
}
export default function HomeHeader({ onUserClick, unReadShow }: IHomeHeaderProps) {
  const userInfo = useCurrentUserInfo();
  const copyAddressDrawerOrModalRef = useRef<CopyAddressDrawerOrModalInstance | null>(null);
  return (
    <>
      <CommonHeader
        className="portkey-home-header"
        title={<CustomSvg type="PortkeyLogoV2" />}
        rightElementList={[
          {
            customSvgType: 'Copy5',
            onClick: () => copyAddressDrawerOrModalRef.current?.open(),
          },
          <AccountConnect key="accountConnect" />,
          <div key="userAvatar" className="user-avatar-wrap">
            <Avatar
              size="small"
              avatarUrl={userInfo?.avatar}
              nameIndex={userInfo?.nickName.substring(0, 1).toLocaleUpperCase() || ''}
              onClick={onUserClick}
            />
            {unReadShow && <UnReadBadge />}
          </div>,
        ]}
      />
      <CopyAddressDrawerOrModal ref={copyAddressDrawerOrModalRef} />
    </>
  );
}
