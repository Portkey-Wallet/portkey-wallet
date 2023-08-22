import { useCallback, useEffect } from 'react';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import aes from '@portkey-wallet/utils/aes';
import { useInitIM } from '@portkey-wallet/hooks/hooks-ca/im';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getWallet } from '@portkey-wallet/utils/aelf';
// import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';

export default function useInit() {
  const isShowChat = true;
  // TODO
  // const isShowChat = useIsChatShow();
  const initIm = useInitIM();
  const { walletInfo } = useCurrentWallet();
  const init = useCallback(async () => {
    const getSeedResult = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
    const pin = getSeedResult.data.privateKey;
    if (!pin) return;

    const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, pin);
    const account = getWallet(privateKey || '');
    if (!account || !walletInfo.caHash) return;

    try {
      await initIm(account, walletInfo.caHash);
    } catch (error) {
      console.log('im init error', error);
    }
  }, [initIm, walletInfo.AESEncryptPrivateKey, walletInfo.caHash]);

  useEffect(() => {
    isShowChat && init();
  }, [init, isShowChat]);
}
