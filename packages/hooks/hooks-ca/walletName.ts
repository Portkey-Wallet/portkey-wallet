import { useCallback, useState } from 'react';
import { ChainId } from '@portkey/provider-types';
import walletNameService from '@portkey-wallet/utils/walletName';

export const useSetNewWalletName = () => {
  const [shouldShowSetNewWalletNameModal, setShouldShowSetNewWalletNameModal] = useState(false);
  const [shouldShowSetNewWalletNameIcon, setShouldShowSetNewWalletNameIcon] = useState(false);

  const updateShouldData = useCallback(async () => {
    const shouldShowModal = await walletNameService.shouldShowSetNewWalletNameModal();
    const shouldShowIcon = await walletNameService.shouldShowSetNewWalletNameIcon();
    setShouldShowSetNewWalletNameModal(shouldShowModal);
    setShouldShowSetNewWalletNameIcon(shouldShowIcon);
  }, []);

  const handleSetNewWalletName = useCallback(
    async ({ caHash, chainId }: { caHash?: string; chainId?: ChainId }) => {
      if (!caHash || !chainId) throw new Error('Missing caHash or chainId');
      await walletNameService.setNewWalletName({ caHash, chainId, replaceNickname: true });
      await updateShouldData();
    },
    [updateShouldData],
  );

  const handleCancelSetNewWalletNameModal = useCallback(
    async ({ caHash, chainId }: { caHash?: string; chainId?: ChainId }) => {
      if (!caHash || !chainId) throw new Error('Missing caHash or chainId');
      await walletNameService.setNewWalletName({ caHash, chainId, replaceNickname: false });
      await updateShouldData();
    },
    [updateShouldData],
  );

  return {
    shouldShowSetNewWalletNameModal,
    shouldShowSetNewWalletNameIcon,
    handleSetNewWalletName,
    handleCancelSetNewWalletNameModal,
  };
};
