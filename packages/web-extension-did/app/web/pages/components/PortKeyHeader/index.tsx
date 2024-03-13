import { forwardRef } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import CustomSvg from 'components/CustomSvg';
import './index.less';
import UnReadBadge from 'pages/components/UnReadBadge';
import Avatar from '../Avatar';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';

interface PortKeyHeaderProps {
  onUserClick?: (e?: any) => void;
  customLogoShow?: boolean;
  unReadShow?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PortKeyHeader = forwardRef(({ onUserClick, customLogoShow = true, unReadShow = false }: PortKeyHeaderProps) => {
  const { isPrompt } = useCommonState();
  const { userInfo } = useWallet();

  return (
    // <div className={isPrompt ? 'prompt-portkey-header' : 'portkey-header'}>
    <div className={'portkey-header'}>
      <div className="portkey-header-body">
        <div className="portkey-area">
          {isPrompt ? (
            <CustomSvg type="PortKeyPrompt" className="portkey-logo-prompt" />
          ) : (
            <CustomSvg type="PortKey" className="portkey-logo" />
          )}
        </div>

        {customLogoShow && (
          <div className="custom-logo-wrap">
            <Avatar
              wrapperClass="custom-logo"
              avatarUrl={userInfo?.avatar}
              nameIndex={userInfo?.nickName.substring(0, 1).toLocaleUpperCase() || ''}
              onClick={onUserClick}
            />
            {unReadShow && <UnReadBadge />}
          </div>
        )}
      </div>
    </div>
  );
});

export default PortKeyHeader;

export interface PortKeyHeaderInstance {
  showManageNetwork: () => void;
}
