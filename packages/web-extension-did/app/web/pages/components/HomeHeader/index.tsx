import { useRef } from 'react';
// import CommonHeader from 'components/CommonHeader';
// import CustomSvg from 'components/CustomSvg';
// import Avatar from '../Avatar';
// import AccountConnect from '../AccountConnect';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
// import UnReadBadge from '../UnReadBadge';
import CopyAddressDrawerOrModal, { ICopyAddressDrawerOrModalInstance } from '../CopyAddressDrawerOrModal';
// import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
// import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { lockWallet } from 'utils/lib/serviceWorkerAction';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';

import './index.less';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useNavigate } from 'react-router';
import { Popover } from 'antd';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import InternalMessage from 'messages/InternalMessage';

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

  const handleExpandView = () => {
    InternalMessage.payload(PortkeyMessageTypes.SETTING).send();
  };

  const { isNotLessThan768 } = useCommonState();

  return (
    <>
      <div className="portkey-home-header">
        {/* <CustomSvgV3 type="Guardians=Portkey" className="portkey-logo-prompt" /> */}
        <div className="header-left" onClick={() => navigate('/setting')}>
          {/* <img src={userInfo.avatar} alt="" /> */}
          <TokenImageDisplay symbol={userInfo.nickName} src={userInfo.avatar} width={20} subDisplay={false} />
          <span>{userInfo.nickName}</span>
          <CustomSvgV3
            type="arrow-down"
            className="portkey-logo-prompt"
            onClick={() => copyAddressDrawerOrModalRef.current?.open()}
          />
        </div>
        <div className="header-right">
          <CustomSvgV3
            type="copyAddress"
            className="portkey-logo-prompt"
            onClick={() => copyAddressDrawerOrModalRef.current?.open()}
          />
          {isNotLessThan768 ? (
            <>
              <CustomSvgV3
                type="gear"
                className="portkey-logo-prompt"
                fillColor="rgba(255,255,255,0.7)"
                onClick={() => navigate('/setting')}
              />
              <CustomSvgV3
                type="lock_filled"
                fillColor="rgba(255,255,255,0.7)"
                className="portkey-logo-prompt"
                onClick={lockWallet}
              />
            </>
          ) : (
            <Popover
              content={
                <div className="home-popover-content">
                  <div className="popover-list" onClick={lockWallet}>
                    <CustomSvgV3 type="lock-home" className="portkey-logo-prompt" />
                    <span>Lock</span>
                  </div>
                  <div className="popover-list" onClick={handleExpandView}>
                    <CustomSvgV3 type="expand" className="portkey-logo-prompt" />
                    <span>Expand view</span>
                  </div>
                </div>
              }
              overlayClassName="home-popover"
              placement="bottomRight"
              trigger="click">
              <CustomSvgV3 type="moreHome" className="portkey-logo-prompt" />
            </Popover>
          )}
        </div>
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
