import { useMemo } from 'react';
import AddressCard from '../components/AddressCard';
import { CommonButton } from '@portkey/did-ui-react';
import { useCurrentWallet, useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useNavigateState } from 'hooks/router';
import './AddressSelectModal.less';
import { useAddressesTokensInfo } from '../hooks/useAddressesTokensInfo';

export const AddressSelectModalContent = () => {
  const currentWallet = useCurrentWallet();
  const walletList = useWalletListState();
  const navigate = useNavigateState();

  const accountsAddress = useMemo(
    () =>
      walletList
        .map((wallet) => wallet.accountList)
        .flat()
        .map((account) => account.address),
    [walletList],
  );
  const { addressesTotalBalanceInUsd } = useAddressesTokensInfo(accountsAddress);

  return (
    <>
      <div className="address-select-modal-list">
        {walletList.map((item, index) => (
          <AddressCard
            walletInfo={item}
            currentWallet={currentWallet}
            key={item.name || '_' + index}
            addressSelecting={true}
            addressesTotalBalanceInUsd={addressesTotalBalanceInUsd}
          />
        ))}
      </div>
      <div className="address-select-modal-manage-btn-container">
        <CommonButton
          type="outline"
          className="address-select-modal-manage-btn"
          block
          onClick={() => {
            navigate('/wallet/manage');
          }}>
          Add & manage wallets
        </CommonButton>
      </div>
    </>
  );
};
