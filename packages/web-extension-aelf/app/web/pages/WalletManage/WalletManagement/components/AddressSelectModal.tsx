import { useMemo } from 'react';
import AddressCard from '../components/AddressCard';
import { CommonButton } from '@portkey/did-ui-react';
import { useCurrentWallet, useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useNavigateState } from 'hooks/router';
import './AddressSelectModal.less';
import { useAddressesTokensInfo } from '../hooks/useAddressesTokensInfo';
// import { useCommonState } from 'store/Provider/hooks';
// import InternalMessage from 'messages/InternalMessage';
// import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';

export const AddressSelectModalContent = ({ afterSelect }: { afterSelect?: () => void }) => {
  const currentWallet = useCurrentWallet();
  const walletList = useWalletListState();
  const navigate = useNavigateState();
  // const { isPrompt } = useCommonState();

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
            afterSelect={afterSelect}
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
            // if (!isPrompt) {
            //   InternalMessage.payload(PortkeyMessageTypes.WALLET_MANAGE).send();
            //   return;
            // }
            navigate('/wallet/manage');
          }}>
          Add & manage wallets
        </CommonButton>
      </div>
    </>
  );
};
