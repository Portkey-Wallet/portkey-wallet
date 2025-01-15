import { forwardRef } from 'react';
// import { useCommonState } from 'store/Provider/hooks';
// import CustomSvg from 'components/CustomSvg';
import './index.less';
// import UnReadBadge from 'pages/components/UnReadBadge';
// import Avatar from '../Avatar';
// import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { CustomSvgV3 } from '../../../components/CustomSvgV3';
import clsx from 'clsx';

interface PortKeyHeaderProps {
  onUserClick?: (e?: any) => void;
  customLogoShow?: boolean;
  unReadShow?: boolean;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PortKeyHeader = forwardRef(
  ({ onUserClick, customLogoShow = true, unReadShow = false, className }: PortKeyHeaderProps) => {
    console.log(onUserClick, unReadShow, customLogoShow);
    // const { isPrompt } = useCommonState();
    // const userInfo = useCurrentUserInfo();

    return (
      // <div className={isPrompt ? 'prompt-portkey-header' : 'portkey-header'}>
      <div className={clsx('portkey-header', className)}>
        <div className="portkey-header-body">
          <div className="portkey-area">
            <CustomSvgV3 type="logo" className="portkey-logo-prompt" />
          </div>

          {/* {customLogoShow && (
          <div className="custom-logo-wrap">
            <Avatar
              wrapperClass="custom-logo"
              avatarUrl={userInfo?.avatar}
              nameIndex={userInfo?.nickName?.substring(0, 1).toLocaleUpperCase() || ''}
              onClick={onUserClick}
            />
            {unReadShow && <UnReadBadge />}
          </div>
        )} */}
        </div>
      </div>
    );
  },
);

export default PortKeyHeader;

export interface PortKeyHeaderInstance {
  showManageNetwork: () => void;
}
