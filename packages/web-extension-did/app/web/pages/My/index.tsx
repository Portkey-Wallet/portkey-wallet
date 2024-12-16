import { Button } from 'antd';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import MenuItem from 'components/MenuItem';
import CustomSvg from 'components/CustomSvg';
import CommonHeader from 'components/CommonHeader';
import { lockWallet } from 'utils/lib/serviceWorkerAction';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useIsImputation } from '@portkey-wallet/hooks/hooks-ca/contact';
import svgsList from 'assets/svgs';
import UnReadBadge from 'pages/components/UnReadBadge';
import WalletEntry from '../Wallet/components/WalletEntry';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { IMenuItemInfo, useMenuList } from './useMenuList';

export default function My() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  const isImputation = useIsImputation();

  const MenuList: IMenuItemInfo[] = useMenuList();

  const handleExpandView = () => {
    InternalMessage.payload(PortkeyMessageTypes.SETTING).send();
  };

  const menuItemIcon = (iconType: keyof typeof svgsList, unReadShow: boolean) => {
    return (
      <div className="menu-icon-wrap">
        <CustomSvg type={iconType || 'Aelf'} />
        {unReadShow && <UnReadBadge />}
      </div>
    );
  };

  const { nickName, avatar, userId } = useCurrentUserInfo();

  return (
    <div className="flex-column my-frame">
      <CommonHeader
        className="my-header"
        title={t('Settings')}
        rightElementList={[
          <div key="lock" className="lock-wrap flex-center cursor-pointer" onClick={lockWallet}>
            <CustomSvg className="lock-icon" type="LockOutlined" />
            <span className="lock-text">{t('Lock')}</span>
          </div>,
        ]}
        onLeftBack={() => {
          navigate('/');
        }}
        onLeftBackShowClose={true}
      />

      <div className="wallet-entry-container">
        <WalletEntry
          walletAvatar={avatar}
          walletName={nickName}
          portkeyId={userId}
          clickAvatar={() => {
            navigate('/setting/wallet/wallet-name');
          }}
        />
      </div>

      <div className="empty-placeholder" />

      <div className="flex my-content">
        <div className="menu-list">
          {MenuList.map((item, index) => {
            if (item.type === 'divider') {
              return <div key={index} className="empty-placeholder" />;
            }
            return (
              <MenuItem
                key={item.label}
                height={56}
                icon={menuItemIcon(item.icon, isImputation && item.label === 'Contacts')}
                onClick={() => {
                  if (item.router.match('http')) {
                    window.open(item.router);
                    return;
                  }
                  navigate(item.router);
                }}>
                <div className="flex-between">
                  {t(item.label)}
                  {item.element}
                </div>
              </MenuItem>
            );
          })}
          {/* <MenuItem key="referral" height={56} icon={<CustomSvg type="Referral" />} onClick={clickReferral}>
            <div className="flex-between-center">
              <div>Referral</div>
              <div className="referral-tag flex-center">New</div>
            </div>
          </MenuItem> */}
        </div>
        {!isPrompt && (
          <div className="btn flex-center">
            <Button type="link" onClick={handleExpandView}>
              <div className="flex-center">
                <CustomSvg type="ExpandBlue" />
                &nbsp;&nbsp;
                <span>{t('Expand View')}</span>
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
