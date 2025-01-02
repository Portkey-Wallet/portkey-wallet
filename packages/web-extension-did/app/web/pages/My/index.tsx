import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import MenuItem from 'components/MenuItem';
import CommonHeader from 'components/CommonHeader';
import './index.less';
import { useIsImputation } from '@portkey-wallet/hooks/hooks-ca/contact';
import UnReadBadge from 'pages/components/UnReadBadge';
import WalletEntry from '../Wallet/components/WalletEntry';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { IMenuItemInfo, useMenuList } from './useMenuList';
import { IconTypeV3 } from 'types/icon';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import ExitWallet from '../Wallet/components/ExitWallet';
import { useState } from 'react';
import SetNewWalletNameIcon from '../Home/components/SetNewWalletNameIcon';

export default function My() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isImputation = useIsImputation();

  const MenuList: IMenuItemInfo[] = useMenuList();

  const menuItemIcon = (iconType: IconTypeV3, unReadShow: boolean) => {
    return (
      <div className="menu-icon-wrap">
        {/*<CustomSvg type={iconType || 'Aelf'} />*/}
        <CustomSvgV3 type={iconType || 'Aelf'} />
        {unReadShow && <UnReadBadge />}
      </div>
    );
  };

  const { nickName, avatar, userId } = useCurrentUserInfo();

  const [exitVisible, setExitVisible] = useState<boolean>(false);
  const onExit = () => {
    setExitVisible(true);
  };
  const onCancelExit = () => {
    setExitVisible(false);
  };

  return (
    <div className="flex-column my-frame">
      <CommonHeader
        className="my-header"
        title={t('Settings')}
        onLeftBack={() => {
          navigate('/');
        }}
        onLeftBackShowClose={true}
      />

      {/* For some users register in old versions */}
      <div className="set-new-wallet-name-container">
        <SetNewWalletNameIcon />
      </div>

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
                height={48}
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
        </div>
      </div>

      <div>
        <ExitWallet
          exitText={t('Sign out')}
          exitVisible={exitVisible}
          className="exit-btn"
          onExit={onExit}
          onCancelExit={onCancelExit}
        />
      </div>
    </div>
  );
}
