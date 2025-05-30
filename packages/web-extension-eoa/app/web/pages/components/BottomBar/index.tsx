import clsx from 'clsx';
import CustomSvg, { SvgType } from 'components/CustomSvg';
import { useUnreadCount } from '@portkey-wallet/hooks/hooks-ca/im';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { UnreadTip } from '@portkey-wallet/im-ui-web';
import { useLocationState, useNavigateState } from 'hooks/router';
import { useMemo } from 'react';
import './index.less';

export interface IBottomBarProps {
  className?: string;
}

export default function BottomBar({ className }: IBottomBarProps) {
  const isShowChat = useIsChatShow();
  const unreadCount = useUnreadCount();
  const navigate = useNavigateState();
  const { pathname } = useLocationState();
  const functionList = useMemo(
    () => [
      {
        title: 'Wallet',
        icon: 'PortkeyBar',
        link: '/',
      },
      {
        title: 'Trade',
        icon: 'TradeBar',
        link: '/trade',
      },
    ],
    [],
  );

  return (
    <div className={clsx('bottom-bar-warp', 'flex', className)}>
      {functionList.map((fn, index) => (
        <div
          key={`${fn.title}_${index}`}
          className={clsx('function-item', 'flex-center', fn.link === pathname && 'is-active')}>
          <div className="function-item-click-wrap flex-column-center" onClick={() => navigate(fn.link)}>
            <CustomSvg className="function-item-icon" type={fn.icon as SvgType} />
            <div className="function-item-title">{fn.title}</div>
          </div>
        </div>
      ))}
      {isShowChat && (
        <div className={clsx('function-item', 'flex-center', '/chat-list' === pathname && 'is-active')}>
          <div className="function-item-click-wrap flex-column-center" onClick={() => navigate('/chat-list')}>
            <div className="chat-icon-wrap">
              <CustomSvg className="function-item-icon" type="ChatEntry" />
              {unreadCount > 0 && (
                <div className="chat-entry-unread">
                  <UnreadTip unread={unreadCount} />
                </div>
              )}
            </div>
            <div className="function-item-title">Chat</div>
          </div>
        </div>
      )}
    </div>
  );
}
