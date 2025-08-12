import React, { useCallback } from 'react';
import AddressCardHeader from './AddressCardHeader';
import './AddressCardBase.less';
import { LOCAL_AVATARS } from 'assets/images/avatars/avatars';
import { TWalletInfo, TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { changeCurrentWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useNavigateState, useLocationState } from 'hooks/router';

interface AddressCardBaseProps {
  viewOnly?: boolean;
  addressSelecting?: boolean;
  afterSelect?: () => void;
  cardTouchable?: boolean;
  addressManaging?: boolean;
  addressManageView?: boolean;
  removeWalletDisabled?: boolean;
  addAddressDisabled?: boolean;
  accountState?: string;
  addNewAddress?: () => void;
  walletInfo?: TWalletInfo;
  currentWallet?: TWalletInfo;
  addressesTotalBalanceInUsd?: { [key: string]: number | string };
}

const AddressCardBase: React.FC<AddressCardBaseProps> = ({
  viewOnly = false,
  addressSelecting = false,
  afterSelect,
  cardTouchable = false,
  addressManaging = false,
  addressManageView = false,
  removeWalletDisabled = false,
  addAddressDisabled = false,
  accountState = '',
  addNewAddress,
  walletInfo,
  // currentWallet,
  addressesTotalBalanceInUsd = {},
}) => {
  const currentAccount = useCurrentAccount();
  const dispatch = useAppCommonDispatch();
  const navigate = useNavigateState();
  const { search } = useLocationState();

  const cardOperation = useCallback(
    (account: TAccountInfo, currentWalletKey: string) => {
      if (addressManageView) {
        // TODO: 跳转到地址详情页
        navigate('/wallet/address/detail' + search, {
          state: {
            currentWalletKey: currentWalletKey,
            currentAddress: account.address,
          },
        });
      }
      if (addressSelecting) {
        dispatch(
          changeCurrentWallet({
            address: account.address,
          }),
        );
        // TODO: 关闭选择弹窗
        if (afterSelect) {
          afterSelect();
        }
      }
    },
    [addressManageView, addressSelecting, dispatch, navigate, afterSelect, search],
  );

  return (
    <div className="address-card-base">
      <AddressCardHeader
        privateKeyTipShow={addressManageView}
        useManageStyle={addressManaging}
        walletInfo={walletInfo}
        removeWalletDisabled={removeWalletDisabled}
      />
      <div className="address-card-base-list">
        {walletInfo?.accountList.map((account: TAccountInfo, index: number) => {
          const isSelected = currentAccount?.address === account.address;
          const totalBalanceInUsd = addressesTotalBalanceInUsd[account.address];
          return (
            <div key={index}>
              <div
                className="address-card-base-list-item"
                onClick={cardTouchable ? () => cardOperation(account, walletInfo?.key) : undefined}>
                <img
                  className="address-card-base-avatar"
                  src={LOCAL_AVATARS[account.icon || 'avatar_1']}
                  alt="avatar"
                />
                <div className="address-card-base-info">
                  <span className="address-card-base-title">{account.name || account.address.slice(0, 8)}</span>
                  <span className="address-card-base-balance">{totalBalanceInUsd ? `$${totalBalanceInUsd}` : '-'}</span>
                </div>
                {addressManageView && !isSelected && <span className="address-card-base-chevron">›</span>}
                {(addressSelecting || addressManageView) && isSelected && <CustomSvgV3 type="selected" />}
              </div>
              <div className="address-card-base-divider" />
            </div>
          );
        })}
        {/* Add address button (only if not viewOnly and has mnemonic) */}
        {!viewOnly && walletInfo?.AESEncryptMnemonic && addNewAddress && (
          <div
            className={`address-card-base-list-item add-address${addAddressDisabled ? ' disabled' : ''}`}
            onClick={addAddressDisabled ? undefined : addNewAddress}>
            {/* 加载中效果 */}
            {accountState === 'adding' ? (
              // TODO: 替换为插件统一的 loading 组件
              <span className="address-card-base-add-loading">Loading...</span>
            ) : (
              <>
                <CustomSvgV3 className="address-card-base-add-icon" type="add" />
                <span className="address-card-base-add-text">Add address</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressCardBase;
