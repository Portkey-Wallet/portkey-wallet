import CommonHeader from 'components/CommonHeader';
import CustomSvg from 'components/CustomSvg';
import Avatar from '../Avatar';
import AccountConnect from '../AccountConnect';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import UnReadBadge from '../UnReadBadge';
import './index.less';

export interface IHomeHeaderProps {
  onUserClick?: (e?: any) => void;
  unReadShow?: boolean;
}
export default function HomeHeader({ onUserClick, unReadShow }: IHomeHeaderProps) {
  const userInfo = useCurrentUserInfo();
  return (
    <CommonHeader
      className="portkey-home-header"
      title={<CustomSvg type="PortkeyLogoV2" />}
      rightElementList={[
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
  );
}
