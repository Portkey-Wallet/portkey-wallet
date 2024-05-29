import { useCallback, useState } from 'react';
import { ChainId } from '@portkey/provider-types';
import walletNameService from '@portkey-wallet/utils/walletName';

export const useSetNewWalletName = ({ caHash, chainId }: { caHash: string; chainId: ChainId }) => {
  const [shouldShowSetNewWalletNameModal, setShouldShowSetNewWalletNameModal] = useState(false);
  const [shouldShowSetNewWalletNameIcon, setShouldShowSetNewWalletNameIcon] = useState(false);

  const updateShouldData = useCallback(async () => {
    const shouldShowModal = await walletNameService.shouldShowSetNewWalletNameModal();
    const shouldShowIcon = await walletNameService.shouldShowSetNewWalletNameIcon();
    setShouldShowSetNewWalletNameModal(shouldShowModal);
    setShouldShowSetNewWalletNameIcon(shouldShowIcon);
  }, []);

  const handleSetNewWalletName = useCallback(async () => {
    await walletNameService.setNewWalletName({ caHash, chainId, replaceNickname: true });
    await updateShouldData();
  }, [caHash, chainId, updateShouldData]);

  const handleCancelSetNewWalletNameModal = useCallback(async () => {
    await walletNameService.setNewWalletName({ caHash, chainId, replaceNickname: false });
    await updateShouldData();
  }, [caHash, chainId, updateShouldData]);

  return {
    shouldShowSetNewWalletNameModal,
    shouldShowSetNewWalletNameIcon,
    handleSetNewWalletName,
    handleCancelSetNewWalletNameModal,
  };
};
