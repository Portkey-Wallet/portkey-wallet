import { useAppCASelector } from '.';
import { getAchToken } from '@portkey-wallet/api/api-did/payment/util';
import { AchTokenInfoType } from '@portkey-wallet/store/store-ca/payment/type';
import { useCallback } from 'react';
import { useGuardiansInfo } from './guardian';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useIsMainnet } from './network';
import { ACH_MERCHANT_NAME } from '@portkey-wallet/constants/constants-ca/payment';
import { AchTxAddressReceivedType, SellTransferParams } from '@portkey-wallet/types/types-ca/payment';
import signalrSell from '@portkey-wallet/socket/socket-sell';
import { request } from '@portkey-wallet/api/api-did';
import { randomId } from '@portkey-wallet/utils';

export const usePayment = () => useAppCASelector(state => state.payment);

export const useGetAchTokenInfo = () => {
  const { userGuardiansList } = useGuardiansInfo();

  return useCallback(async (): Promise<AchTokenInfoType | undefined> => {
    if (userGuardiansList === undefined) {
      throw new Error('userGuardiansList is undefined');
    }

    const emailGuardian = userGuardiansList?.find(item => item.guardianType === LoginType.Email && item.isLoginAccount);
    if (emailGuardian === undefined) {
      return undefined;
    }

    const rst = await getAchToken({ email: emailGuardian.guardianAccount });
    const achTokenInfo = {
      token: rst.accessToken,
      expires: Date.now() + 24 * 60 * 60 * 1000,
    };

    return achTokenInfo;
  }, [userGuardiansList]);
};

export const useSellTransfer = () => {
  const isMainnet = useIsMainnet();

  return useCallback(
    async ({ merchantName, orderId, paymentSellTransfer }: SellTransferParams) => {
      if (!isMainnet || merchantName !== ACH_MERCHANT_NAME) return;

      const clientId = randomId();
      await signalrSell.doOpen({
        url: `${request.defaultConfig.baseURL}/ca`,
        clientId,
      });

      const achTxAddressReceived = await new Promise<AchTxAddressReceivedType>(resolve => {
        const { remove } = signalrSell.onAchTxAddressReceived({ clientId, orderId }, data => {
          resolve(data);
          remove();
        });
        signalrSell.requestAchTxAddress(clientId, orderId);
      });
      const result = await paymentSellTransfer(achTxAddressReceived);
      if (result.error) {
        throw result.error;
      }
      if (!result.transactionId) {
        throw new Error('transaction is error');
      }

      await request.payment.setOrderTxHash({
        params: {
          merchantName: ACH_MERCHANT_NAME,
          orderId,
          txHash: result.transactionId,
        },
      });
    },
    [isMainnet],
  );
};
