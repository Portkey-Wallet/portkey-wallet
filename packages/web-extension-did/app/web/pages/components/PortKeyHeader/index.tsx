import { forwardRef } from 'react';
import { useCommonState, useWalletInfo } from 'store/Provider/hooks';
import CustomSvg from 'components/CustomSvg';
import svgsList from 'assets/svgs';
import './index.less';

export type WalletAvatar = keyof typeof svgsList;

interface PortKeyHeaderProps {
  onUserClick?: (e?: any) => void;
  customLogoShow?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PortKeyHeader = forwardRef(({ onUserClick, customLogoShow = true }: PortKeyHeaderProps) => {
  const { isPrompt } = useCommonState();
  const { walletAvatar } = useWalletInfo();

  return (
    // <div className={isPrompt ? 'prompt-portkey-header' : 'portkey-header'}>
    <div className={'portkey-header'}>
      <div className="portkey-header-body">
        <div className="portkey-area">
          <CustomSvg type="PortKey" className="portkey-logo" />
          {isPrompt && <div className="portkey-label">PORTKEY</div>}
        </div>

        {customLogoShow && (
          <CustomSvg className="custom-logo" type={(walletAvatar as WalletAvatar) || 'master1'} onClick={onUserClick} />
        )}
      </div>
    </div>
  );
});

export default PortKeyHeader;

export interface PortKeyHeaderInstance {
  showManageNetwork: () => void;
}
