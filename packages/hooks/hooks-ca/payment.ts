import { useAppCASelector } from '.';
import { getAchToken } from '@portkey-wallet/api/api-did/payment/util';
import { AchTokenInfoType } from '@portkey-wallet/store/store-ca/payment/type';
import { useCallback, useRef } from 'react';
import { useGuardiansInfo } from './guardian';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useIsMainnet } from './network';
import { ACH_MERCHANT_NAME, SELL_SOCKET_TIMEOUT } from '@portkey-wallet/constants/constants-ca/payment';
import { RequestOrderTransferredType, SellTransferParams } from '@portkey-wallet/types/types-ca/payment';
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

enum STAGE {
  ACHTXADS, // onAchTxAddressReceived
  TRANSACTION, // transaction
  ORDER, // onRequestOrderTransferred
}

export const useSellTransfer = () => {
  const isMainnet = useIsMainnet();
  const status = useRef<STAGE>(STAGE.ACHTXADS);

  return useCallback(
    async ({ merchantName, orderId, paymentSellTransfer }: SellTransferParams) => {
      if (!isMainnet || merchantName !== ACH_MERCHANT_NAME) return;

      let signalrAchTxRemove: (() => void) | undefined;
      let signalrOrderRemove: (() => void) | undefined;
      let timer: NodeJS.Timeout | undefined = undefined;
      const clientId = randomId();

      try {
        await signalrSell.doOpen({
          url: `${request.defaultConfig.baseURL}/ca`,
          clientId,
        });
      } catch (error) {
        throw new Error('Transaction failed.');
      }

      const timerPromise = new Promise<'timeout'>(resolve => {
        timer = setTimeout(() => {
          resolve('timeout');
        }, SELL_SOCKET_TIMEOUT);
      });

      const signalrSellPromise = new Promise<RequestOrderTransferredType | null>(resolve => {
        const { remove: removeAchTx } = signalrSell.onAchTxAddressReceived({ clientId, orderId }, async data => {
          if (data === null) {
            throw new Error('Transaction failed.');
          }

          try {
            status.current = STAGE.TRANSACTION;
            const result = await paymentSellTransfer(data);
            await request.payment.sendSellTransaction({
              params: {
                merchantName: ACH_MERCHANT_NAME,
                orderId,
                rawTransaction: result.rawTransaction,
                signature: result.signature,
                publicKey: result.publicKey,
              },
            });
          } catch (e) {
            resolve(null);
            return;
          }

          const { remove: removeRes } = signalrSell.onRequestOrderTransferred({ clientId, orderId }, async data => {
            status.current = STAGE.ORDER;
            resolve(data);
          });
          signalrOrderRemove = removeRes;
          signalrSell.requestOrderTransferred(clientId, orderId);
        });
        signalrAchTxRemove = removeAchTx;
        signalrSell.requestAchTxAddress(clientId, orderId);
      });

      const signalrSellResult = await Promise.race([timerPromise, signalrSellPromise]);

      if (signalrSellResult === null) throw new Error('Transaction failed.');
      if (signalrSellResult === 'timeout') {
        if (status.current === STAGE.ACHTXADS) throw new Error('Transaction failed.');
        throw {
          code: 'TIMEOUT',
          message: 'The waiting time is too long, it will be put on hold in the background.',
        };
      }
      if (signalrSellResult.status !== 'Transferred') throw new Error('Transaction failed.');

      signalrAchTxRemove?.();
      signalrAchTxRemove = undefined;
      signalrOrderRemove?.();
      signalrOrderRemove = undefined;

      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      signalrSell.stop();
    },
    [isMainnet],
  );
};
