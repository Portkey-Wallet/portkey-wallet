import { Button } from 'antd';
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import MenuItem from 'components/MenuItem';
import CustomSvg from 'components/CustomSvg';
import BackHeader from 'components/BackHeader';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import { useLockWallet } from 'utils/lib/serviceWorkerAction';
import { IconType } from 'types/icon';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useIsImputation } from '@portkey-wallet/hooks/hooks-ca/contact';
import svgsList from 'assets/svgs';
import UnReadBadge from 'pages/components/UnReadBadge';
import UpgradeTip from 'pages/components/UpgradeTip';

interface MenuItemInfo {
  label: string;
  icon: IconType;
  router: string;
}

export default function My() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lockWallet = useLockWallet();
  const { isPrompt } = useCommonState();
  const isImputation = useIsImputation();

  const MenuList: MenuItemInfo[] = useMemo(
    () => [
      {
        label: 'Wallet',
        icon: 'Wallet',
        router: '/setting/wallet',
      },
      {
        label: 'Contacts',
        icon: 'AddressBook2',
        router: '/setting/contacts',
      },
      {
        label: 'Account Setting',
        icon: 'Setting',
        router: '/setting/account-setting',
      },
      {
        label: 'Guardians',
        icon: 'Guardians',
        router: '/setting/guardians',
      },
      {
        label: 'Wallet Security',
        icon: 'Security',
        router: '/setting/wallet-security',
      },
    ],
    [],
  );

  const handleLock = useCallback(() => {
    lockWallet();
    navigate('/unlock');
  }, [lockWallet, navigate]);

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

  return (
    <div className="flex-column my-frame">
      <PortKeyHeader
        unReadShow={isImputation}
        onUserClick={() => {
          navigate('/');
        }}
      />
      <BackHeader
        title={t('My')}
        leftCallBack={() => {
          navigate('/');
        }}
        rightElement={<Button onClick={handleLock}>{t('Lock')}</Button>}
      />
      <UpgradeTip />
      <div className="flex my-content">
        <div className="menu-list">
          {MenuList.map((item) => (
            <MenuItem
              key={item.label}
              height={56}
              icon={menuItemIcon(item.icon, !!(isImputation && item.label === 'Contacts'))}
              onClick={() => {
                navigate(item.router);
              }}>
              {t(item.label)}
            </MenuItem>
          ))}
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
