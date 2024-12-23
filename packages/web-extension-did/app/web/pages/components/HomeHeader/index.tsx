import { useRef } from 'react';
// import CommonHeader from 'components/CommonHeader';
// import CustomSvg from 'components/CustomSvg';
// import Avatar from '../Avatar';
// import AccountConnect from '../AccountConnect';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
// import UnReadBadge from '../UnReadBadge';
import CopyAddressDrawerOrModal, { ICopyAddressDrawerOrModalInstance } from '../CopyAddressDrawerOrModal';
// import { useNavigate } from 'react-router';
// import { useCommonState } from 'store/Provider/hooks';
// import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import './index.less';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useNavigate } from 'react-router';

export interface IHomeHeaderProps {
  onUserClick?: (e?: any) => void;
  unReadShow?: boolean;
}

export default function HomeHeader({ onUserClick, unReadShow }: IHomeHeaderProps) {
  console.log(onUserClick, unReadShow);
  const userInfo = useCurrentUserInfo();
  console.log('userInfo', userInfo);
  const copyAddressDrawerOrModalRef = useRef<ICopyAddressDrawerOrModalInstance | null>(null);
  // const navigate = useNavigate();
  // const { isPrompt } = useCommonState();
  // const isMainnet = useIsMainnet();
  const navigate = useNavigate();

  return (
    <>
      <div className="portkey-home-header">
        {/* <CustomSvgV3 type="Guardians=Portkey" className="portkey-logo-prompt" /> */}
        <div className="header-left" onClick={() => navigate('/setting')}>
          <img src={userInfo.avatar} alt="" />
          <span>{userInfo.nickName}</span>
          <CustomSvgV3
            type="arrow-down"
            className="portkey-logo-prompt"
            onClick={() => copyAddressDrawerOrModalRef.current?.open()}
          />
        </div>
        <CustomSvgV3
          type="copyAddress"
          className="portkey-logo-prompt"
          onClick={() => copyAddressDrawerOrModalRef.current?.open()}
        />
      </div>
      {/* <CommonHeader
        className="portkey-home-header"
        title={}
        rightElementList={[
          // {
          //   customSvgType: 'RedGiftIcon',
          //   onClick: () => navigate('/crypto-gifts'),
          // },
          {
            customSvgType: 'copyAddress',
            onClick: () => ,
          },
          // <>{isPrompt ? null : <AccountConnect key="accountConnect" />}</>,
          // <div key="userAvatar" className="user-avatar-wrap">
          //   <Avatar
          //     size="small"
          //     avatarUrl={userInfo?.avatar}
          //     nameIndex={userInfo?.nickName?.substring(0, 1).toLocaleUpperCase() || ''}
          //     onClick={onUserClick}
          //   />
          //   {unReadShow && <UnReadBadge />}
          // </div>,
        ]}
      /> */}
      <CopyAddressDrawerOrModal ref={copyAddressDrawerOrModalRef} />
    </>
  );
}
