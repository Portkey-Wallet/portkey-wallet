import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import MenuItem from 'components/MenuItem';
import CommonHeader from 'components/CommonHeader';
import './index.less';
// import { useIsImputation } from '@portkey-wallet/hooks/hooks-ca/contact';
import UnReadBadge from 'pages/components/UnReadBadge';
import WalletEntry from '../Wallet/components/WalletEntry';
import { useCurrentAccount, useCurrentWallet } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { IMenuItemInfo, useMenuList } from './useMenuList';
import { IconTypeV3 } from 'types/icon';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import SetNewWalletNameIcon from '../Home/components/SetNewWalletNameIcon';
import { LOCAL_AVATARS } from 'assets/images/avatars/avatars';
import { useAddressesTokensInfo } from 'pages/WalletManage/WalletManagement/hooks/useAddressesTokensInfo';

export default function My() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const currentWallet = useCurrentWallet();
  const currentAccount = useCurrentAccount();
  const { name: nickName, icon: avatar } = currentAccount || {};

  const accountsAddress = useMemo(() => (currentAccount?.address ? [currentAccount.address] : []), [currentAccount]);

  const { addressesTotalBalanceInUsd } = useAddressesTokensInfo(accountsAddress);

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
          walletAvatar={LOCAL_AVATARS[avatar || 'avatar_1']}
          walletName={nickName || 'Address 1'}
          addressesTotalBalanceInUsd={addressesTotalBalanceInUsd}
          currentAccount={currentAccount}
          clickAvatar={() => {
            navigate('/wallet/address/detail', {
              state: {
                backUrl: '/setting',
                currentWalletKey: currentWallet?.key,
                currentAddress: currentAccount?.address,
              },
            });
          }}
        />
      </div>

      <div className="empty-placeholder" />

      <div className="flex my-content my-list-container">
        <div className="menu-list">
          {MenuList.map((item, index) => {
            if (item.type === 'divider') {
              return <div key={index} className="empty-placeholder" />;
            }
            return (
              <MenuItem
                key={item.label}
                height={48}
                // TODO: Unread badge for imputation contacts
                // icon={menuItemIcon(item.icon, isImputation && item.label === 'Contacts')}
                icon={menuItemIcon(item.icon, false)}
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
    </div>
  );
}
