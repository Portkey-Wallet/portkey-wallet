import CustomSvg from 'components/CustomSvg';
import MenuItem from 'components/MenuItem';
import { useLocation, useNavigate } from 'react-router';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import svgsList from 'assets/svgs';
import { lockWallet } from 'utils/lib/serviceWorkerAction';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import CommonHeader from 'components/CommonHeader';
import './index.less';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { useIsImputation } from '@portkey-wallet/hooks/hooks-ca/contact';
import UnReadBadge from 'pages/components/UnReadBadge';
import { useReferral } from '@portkey-wallet/hooks/hooks-ca/referral';
import { hideReferral } from '@portkey-wallet/constants/referral';
import { useClickReferral } from 'hooks/referral';

interface MyMenuItemInfo {
  label: string;
  key: string;
  icon: keyof typeof svgsList;
  pathname: string;
}

export default function PromptMy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isImputation = useIsImputation();
  const { viewReferralStatus } = useReferral();
  const clickReferral = useClickReferral();
  const { pathname } = useLocation();

  const settingList: MyMenuItemInfo[] = useMemo(
    () => [
      { label: 'Wallet', key: 'wallet', pathname: '/setting/wallet', icon: 'Wallet' },
      {
        label: 'Contacts',
        key: 'contacts',
        pathname: '/setting/contacts',
        icon: 'AddressBook2',
      },
      {
        label: 'Account Setting',
        key: 'account-setting',
        pathname: '/setting/account-setting',
        icon: 'Setting',
      },
      { label: 'Guardians', key: 'guardians', pathname: '/setting/guardians', icon: 'Guardians' },
      {
        label: 'Wallet Security',
        key: 'wallet-security',
        pathname: '/setting/wallet-security',
        icon: 'Security',
      },
    ],
    [],
  );

  const curMenuInfo = useMemo(
    () => settingList.find((item) => pathname.split('/').find((k) => k === item.key)) || null,
    [pathname, settingList],
  );

  useEffect(() => {
    if (!curMenuInfo)
      navigate(settingList[0].pathname, {
        replace: true,
      });
  }, [curMenuInfo, navigate, settingList]);

  const backCb = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const menuItemIcon = (iconType: keyof typeof svgsList, unReadShow: boolean) => {
    return (
      <div className="menu-icon-wrap">
        <CustomSvg type={iconType || 'Aelf'} />
        {unReadShow && <UnReadBadge />}
      </div>
    );
  };

  return (
    <div className="prompt-my-page flex-column">
      <PortKeyHeader unReadShow={isImputation || (!hideReferral && !viewReferralStatus)} onUserClick={backCb} />

      <div className="prompt-my-frame">
        <CommonHeader title={t('My')} onLeftBack={backCb} />
        <div className="prompt-my-body">
          <div className="prompt-my-menu-list">
            {settingList.map((item) => (
              <MenuItem
                className={clsx(['menu-item-common', item.key === curMenuInfo?.key ? 'menu-item-selected' : undefined])}
                key={item.key}
                height={56}
                icon={menuItemIcon(item.icon, !!(isImputation && item.key === 'contacts'))}
                onClick={() =>
                  navigate(item.pathname, {
                    replace: true,
                  })
                }
                showEnterIcon={false}>
                {t(item.label)}
              </MenuItem>
            ))}
            <MenuItem
              className="menu-item-common"
              key="referral"
              height={56}
              icon={<CustomSvg type="Referral" />}
              onClick={clickReferral}
              showEnterIcon={false}>
              <div className="flex">
                <div>Referral</div>
                <div className="referral-tag flex-center">New</div>
              </div>
            </MenuItem>
            <div className="lock-row flex-center" onClick={lockWallet}>
              {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
              <CustomSvg type={'Lock'} style={{ width: 16, height: 16 }} />
              <span className="lock-text">{t('Lock')}</span>
            </div>
          </div>
          <div className="prompt-my-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
