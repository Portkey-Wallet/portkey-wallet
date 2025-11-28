import React from 'react';
import { useAddAddress, useEmptyAddress } from '../hooks/useAddAddress';
import AddressCardBase from './AddressCardBase';
import { TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';

export interface IAddressCardProps {
  addressSelecting?: boolean;
  afterSelect?: () => void;
  addressManaging?: boolean;
  addressManageView?: boolean;
  walletInfo?: TWalletInfo;
  currentWallet?: TWalletInfo;
  removeWalletDisabled?: boolean;
  addressesTotalBalanceInUsd?: { [key: string]: number | string };
}

export interface IAddressCardPropsExtend extends IAddressCardProps {
  addAddressDisabled: boolean;
  accountState: string;
  addNewAddress: () => void;
}

export const AddressCard: React.FC<IAddressCardProps> = ({
  addressSelecting = false,
  afterSelect,
  walletInfo,
  currentWallet,
  addressManaging = false,
  removeWalletDisabled = false,
  addressesTotalBalanceInUsd,
}) => {
  const useDynamicHook = addressSelecting ? useEmptyAddress : useAddAddress;
  const { addAddressDisabled, accountState, addNewAddress } = useDynamicHook({ walletInfo });

  if (addressManaging) {
    return (
      <AddressCardManaging
        walletInfo={walletInfo}
        currentWallet={currentWallet}
        removeWalletDisabled={removeWalletDisabled}
        addAddressDisabled={addAddressDisabled}
        accountState={accountState}
        addNewAddress={addNewAddress}
        addressesTotalBalanceInUsd={addressesTotalBalanceInUsd}
      />
    );
  }
  if (addressSelecting) {
    return (
      <AddressCardSelect
        walletInfo={walletInfo}
        currentWallet={currentWallet}
        addAddressDisabled={addAddressDisabled}
        accountState={accountState}
        addNewAddress={addNewAddress}
        addressesTotalBalanceInUsd={addressesTotalBalanceInUsd}
        afterSelect={afterSelect}
      />
    );
  }
  // addressManageView; default
  return (
    <AddressCardManageView
      walletInfo={walletInfo}
      currentWallet={currentWallet}
      addAddressDisabled={addAddressDisabled}
      accountState={accountState}
      addNewAddress={addNewAddress}
      addressesTotalBalanceInUsd={addressesTotalBalanceInUsd}
    />
  );
};

export const AddressCardManageView: React.FC<IAddressCardPropsExtend> = (props) => (
  <AddressCardBase cardTouchable={true} addressManageView={true} {...props} />
);
export const AddressCardManaging: React.FC<IAddressCardPropsExtend> = (props) => (
  <AddressCardBase viewOnly={true} addressManaging={true} {...props} />
);
export const AddressCardSelect: React.FC<IAddressCardPropsExtend> = (props) => (
  <AddressCardBase viewOnly={true} addressSelecting={true} cardTouchable={true} {...props} />
);

export default AddressCard;
