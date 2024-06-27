import { useRef } from 'react';
import CommonHeader from 'components/CommonHeader';
import CustomSvg from 'components/CustomSvg';
import Avatar from '../Avatar';
import AccountConnect from '../AccountConnect';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import UnReadBadge from '../UnReadBadge';
import CopyAddressDrawerOrModal, { ICopyAddressDrawerOrModalInstance } from '../CopyAddressDrawerOrModal';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import './index.less';

export interface IHomeHeaderProps {
  onUserClick?: (e?: any) => void;
  unReadShow?: boolean;
}
export default function HomeHeader({ onUserClick, unReadShow }: IHomeHeaderProps) {
  const userInfo = useCurrentUserInfo();
  const copyAddressDrawerOrModalRef = useRef<ICopyAddressDrawerOrModalInstance | null>(null);
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  const isMainnet = useIsMainnet();
  return (
    <>
      <CommonHeader
        className="portkey-home-header"
        title={<CustomSvg type="PortkeyLogoV2" />}
        rightElementList={[
          isMainnet
            ? {
                customSvgType: 'RedGiftIcon',
                onClick: () => navigate('/crypto-gifts'),
              }
            : null,
          {
            customSvgType: 'Copy5',
            onClick: () => copyAddressDrawerOrModalRef.current?.open(),
          },
          <>{isPrompt ? null : <AccountConnect key="accountConnect" />}</>,
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
