import { useAppCASelector } from '.';
import { getAchToken } from '@portkey-wallet/api/api-did/payment/util';
import { AchTokenInfoType } from '@portkey-wallet/store/store-ca/payment/type';
import { useCallback } from 'react';
import { useGuardiansInfo } from './guardian';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useIsMainnet } from './network';
import { ACH_MERCHANT_NAME, SELL_SOCKET_TIMEOUT } from '@portkey-wallet/constants/constants-ca/payment';
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

      let achTxAddressReceived: AchTxAddressReceivedType;
      let signalrSellRemove: (() => void) | undefined;
      try {
        const clientId = randomId();
        await signalrSell.doOpen({
          url: `${request.defaultConfig.baseURL}/ca`,
          clientId,
        });

        const timerPromise = new Promise<null>(resolve =>
          setTimeout(() => {
            resolve(null);
          }, SELL_SOCKET_TIMEOUT),
        );
        const signalrSellPromise = new Promise<AchTxAddressReceivedType | null>(resolve => {
          const { remove } = signalrSell.onAchTxAddressReceived({ clientId, orderId }, data => {
            resolve(data);
          });
          signalrSellRemove = remove;
          signalrSell.requestAchTxAddress(clientId, orderId);
        });

        const signalrSellResult = await Promise.race([timerPromise, signalrSellPromise]);

        if (signalrSellResult === null) {
          throw new Error('Transaction failed.');
        }
        achTxAddressReceived = signalrSellResult;
      } catch (error) {
        throw {
          code: 'TIMEOUT',
          message: 'Transaction failed.',
        };
      } finally {
        signalrSellRemove?.();
        signalrSellRemove = undefined;
        signalrSell.stop();
      }

      try {
        const result = await paymentSellTransfer(achTxAddressReceived);
        if (result.error || !result.transactionId) {
          throw new Error('Transaction failed.');
        }

        await request.payment.updateAlchemyOrderTxHash({
          params: {
            merchantName: ACH_MERCHANT_NAME,
            orderId,
            txHash: result.transactionId,
          },
        });
      } catch (error) {
        throw {
          code: 'NO_TX_HASH',
          message: 'Transaction failed. Please contact the team for assistance.',
        };
      }
    },
    [isMainnet],
  );
};
