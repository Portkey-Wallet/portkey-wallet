import { Button } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import MenuItem from 'components/MenuItem';
import CustomSvg from 'components/CustomSvg';
import CommonHeader from 'components/CommonHeader';
import { lockWallet } from 'utils/lib/serviceWorkerAction';
import { IconType } from 'types/icon';
import { useCommonState, useDapp, useWalletInfo } from 'store/Provider/hooks';
import './index.less';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useIsImputation } from '@portkey-wallet/hooks/hooks-ca/contact';
import svgsList from 'assets/svgs';
import UnReadBadge from 'pages/components/UnReadBadge';
import WalletEntry from '../Wallet/components/WalletEntry';
import { useCurrentUserInfo, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useIsSecondaryMailSet } from '@portkey-wallet/hooks/hooks-ca/useSecondaryMail';
// import { useClickReferral } from 'hooks/referral';

interface MenuItemInfo {
  label: string;
  icon: IconType;
  router: string;
  element?: JSX.Element;
  type?: string;
}

export default function My() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  const isImputation = useIsImputation();
  const { secondaryEmail, fetching } = useIsSecondaryMailSet();

  // Mange devices
  const { deviceAmount } = useDeviceList({
    isAmountOnly: true,
  });

  // Connected dApps
  const { currentNetwork } = useWalletInfo();
  const { dappMap } = useDapp();
  const currentDapp = useMemo(() => dappMap[currentNetwork] || [], [currentNetwork, dappMap]);

  // const clickReferral = useClickReferral();
  const MenuList: MenuItemInfo[] = useMemo(
    () => [
      {
        label: 'Guardians',
        icon: 'Guardians',
        router: '/setting/guardians',
      },
      {
        label: 'Security',
        icon: 'Guardians',
        router: '/setting/security',
      },
      {
        label: 'Transaction Limits',
        icon: 'Guardians',
        router: '/setting/wallet-security/payment-security',
      },
      {
        label: 'Token allowances',
        icon: 'Guardians',
        router: '/setting/wallet-security/token-allowance',
      },
      {
        label: 'Backup email',
        icon: 'Guardians',
        router: '/setting/wallet-security/token-allowance',
        element: <div className="item-extra-info">{!fetching && !secondaryEmail ? `Not Set up` : ''}</div>,
      },
      {
        type: 'divider',
        label: 'divider',
        icon: 'Guardians',
        router: '',
      },
      {
        label: 'Manage Devices',
        icon: 'Wallet',
        router: '/setting/wallet-security/manage-devices',
        element: <div className="item-extra-info">{deviceAmount}</div>,
      },
      {
        label: 'Connected dApps',
        icon: 'Wallet',
        router: '/setting/wallet-security/connected-sites',
        element: <div className="item-extra-info">{currentDapp.length}</div>,
      },
      {
        label: 'Address book',
        icon: 'Wallet',
        router: '/setting/contacts',
      },
      {
        type: 'divider',
        label: 'divider',
        icon: 'Guardians',
        router: '',
      },
      {
        label: 'Switch network',
        icon: 'Wallet',
        router: '/setting/wallet/switch-networks',
      },
      {
        type: 'divider',
        label: 'divider',
        icon: 'Guardians',
        router: '',
      },
      {
        label: 'Help center',
        icon: 'Wallet',
        // router: '/setting/wallet', //  Todo: new website
        router: 'https://doc.portkey.finance/help', //  Todo: new website
      },
      {
        label: 'About Portkey',
        icon: 'Wallet',
        router: '/setting/wallet/about-us',
      },
      // {
      //   label: 'Check for updates',
      //   icon: 'Wallet',
      //   router: '', // Todo: ??? do or not.
      // },
      // {
      //   label: 'Wallet',
      //   icon: 'Wallet',
      //   router: '/setting/wallet',
      // },
      // {
      //   label: 'Contacts',
      //   icon: 'AddressBook2',
      //   router: '/setting/contacts',
      // },
      // {
      //   label: 'Account Setting',
      //   icon: 'Setting',
      //   router: '/setting/account-setting',
      // },
      // {
      //   label: 'Wallet Security',
      //   icon: 'Security',
      //   router: '/setting/wallet-security',
      // },
    ],
    [currentDapp.length, deviceAmount, fetching, secondaryEmail],
  );

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

      <div>
        <WalletEntry
          walletAvatar={avatar}
          walletName={nickName}
          portkeyId={userId}
          clickAvatar={() => {
            navigate('/setting/wallet/wallet-name');
          }}
        />
        <div className="empty-placeholder" />
      </div>

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
