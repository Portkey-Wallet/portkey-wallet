import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCallback } from 'react';
import { TQueryTransferAuthTokenRequest } from '@portkey-wallet/types/types-ca/deposit';
import depositService from '@portkey-wallet/utils/deposit';
import AElf from 'aelf-sdk';
import { AElfWallet } from '@portkey-wallet/types/aelf';

export const useDeposit = () => {
  const { caHash, address } = useCurrentWalletInfo();
  const { apiUrl } = useCurrentNetworkInfo();

  const fetchTransferToken = useCallback(
    async (manager: AElfWallet) => {
      const plainTextOrigin = `Nonce:${Date.now()}`;
      const plainTextHex = Buffer.from(plainTextOrigin).toString('hex').replace('0x', '');
      const plainTextHexSignature = Buffer.from(plainTextHex).toString('hex');

      const signature = AElf.wallet.sign(plainTextHexSignature, manager.keyPair).toString('hex');
      const pubkey = (manager.keyPair as any).getPublic('hex');

      const params: TQueryTransferAuthTokenRequest = {
        pubkey: pubkey,
        signature: signature,
        plain_text: plainTextHex,
        ca_hash: caHash ?? '',
        chain_id: 'AELF', // todo_wade: fix the chain_id
        managerAddress: address,
      };
      await depositService.getTransferToken(params, apiUrl);
    },
    [address, caHash, apiUrl],
  );

  return {
    fetchTransferToken,
  };
};
