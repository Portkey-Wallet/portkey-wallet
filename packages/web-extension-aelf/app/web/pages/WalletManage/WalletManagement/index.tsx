import React, { useEffect, useMemo, useState } from 'react';
import { useCurrentWallet, useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useNavigateState, useLocationState } from 'hooks/router';
import AddressCard from './components/AddressCard';
import { useAddressesTokensInfo } from './hooks/useAddressesTokensInfo';
import { MAX_WALLET_NUMBER } from '@portkey-wallet/store/store-eoa/wallet/config';
import singleMessage from 'utils/singleMessage';
import { CommonButton } from '@portkey/did-ui-react';
import './components/AddressCardBase.less';
import './WalletManagement.less';
import CommonHeader from 'components/CommonHeader';
import { CustomSvgV3 } from 'components/CustomSvgV3';

export const WalletManagement: React.FC = () => {
  const currentWallet = useCurrentWallet();
  const walletList = useWalletListState();
  const navigate = useNavigateState();
  const { state, search } = useLocationState<{ showManaging?: boolean }>();
  const { showManaging } = state || {};
  const [managing, setManaging] = useState(!!showManaging);
  const [addWalletDisabled, setAddWalletDisabled] = useState(false);

  // 获取所有钱包下所有地址
  const accountsAddress = useMemo(
    () =>
      walletList
        .map((wallet) => wallet.accountList)
        .flat()
        .map((account) => account.address),
    [walletList],
  );
  const { addressesTotalBalanceInUsd } = useAddressesTokensInfo(accountsAddress);

  useEffect(() => {
    if (!walletList) return;
    setAddWalletDisabled(walletList.length >= MAX_WALLET_NUMBER);
  }, [walletList]);

  const failedToastText = `Add up to ${MAX_WALLET_NUMBER} wallets`;

  // 管理/完成切换
  const handleManageToggle = () => {
    setManaging((m) => !m);
  };

  // 导入钱包
  const handleImportWallet = () => {
    if (addWalletDisabled) {
      singleMessage.error(failedToastText);
      return;
    }
    // navigate('/wallet/import');
    navigate('/unlock', {
      state: {
        navigateUrl: '/wallet/import',
      },
    });
  };

  // 新建钱包
  const handleCreateWallet = () => {
    if (addWalletDisabled) {
      singleMessage.error(failedToastText);
      return;
    }
    // navigate('/wallet/create');
    navigate('/unlock', {
      state: {
        navigateUrl: '/wallet/create',
      },
    });
  };

  // 重置App
  const handleResetApp = () => {
    navigate('/wallet/reset');
  };

  return (
    <div className="wallet-management-wrap">
      <CommonHeader
        className="my-header"
        title="Your Wallets"
        onLeftBack={() => {
          navigate(search.match('backTo=setting') ? '/setting' : '/');
        }}
        onLeftBackShowClose={true}
      />
      <div>
        <div className="wallet-management-header">
          <span className="wallet-management-manage-btn" onClick={handleManageToggle}>
            {managing ? 'Done' : 'Manage'}
          </span>
        </div>
        {walletList.map((item, index) => (
          <AddressCard
            walletInfo={item}
            currentWallet={currentWallet}
            addressManaging={managing}
            key={item.key || index}
            removeWalletDisabled={walletList.length <= 1}
            addressesTotalBalanceInUsd={addressesTotalBalanceInUsd}
          />
        ))}
        {!managing && (
          <>
            <div className="wallet-management-divider" />
            <div className="wallet-management-btns">
              <CommonButton
                className="address-card-base-list-item wallet-management-btn"
                onClick={handleImportWallet}
                disabled={addWalletDisabled}
                type="outline"
                block>
                <CustomSvgV3 type="inport" />
                Import existing wallet
              </CommonButton>
              <CommonButton
                className="address-card-base-list-item wallet-management-btn"
                onClick={handleCreateWallet}
                disabled={addWalletDisabled}
                type="outline"
                block>
                <CustomSvgV3 type="Wallet" />
                Create a new wallet
                {/*<span className="wallet-management-advanced">Advanced</span>*/}
              </CommonButton>
            </div>
          </>
        )}
      </div>
      {managing && (
        <div className="wallet-management-reset-wrap">
          <span className="wallet-management-reset-btn" onClick={handleResetApp}>
            Reset app
          </span>
        </div>
      )}
    </div>
  );
};
