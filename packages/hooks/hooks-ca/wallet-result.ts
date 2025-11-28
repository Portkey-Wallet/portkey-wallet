import Socket from '@portkey-wallet/socket/socket-did';
import { useCurrentApiUrl } from '@portkey-wallet/hooks/hooks-ca/network';
import { CreateWalletResult } from '@portkey-wallet/types/types-ca/wallet';
import { requestCreateWallet } from '@portkey-wallet/api/api-did/utils/wallet';
import { sleep } from '@portkey-wallet/utils';
import { useCallback } from 'react';
import { VerificationType } from '@portkey-wallet/types/verifier';

const getCreateResultBySocket = ({
  type,
  apiUrl,
  clientId,
  requestId,
}: {
  apiUrl: string;
  clientId: string;
  requestId: string;
  type: VerificationType;
}): Promise<CreateWalletResult> => {
  return new Promise(resolve => {
    console.log('getCreateResultBySocket');
    Socket.doOpen({
      url: `${apiUrl}/ca`,
      clientId: clientId,
    });
    if (type === VerificationType.register) {
      const { remove } = Socket.onCaAccountRegister(
        {
          clientId,
          requestId: requestId,
        },
        data => {
          console.log('onCaAccountRegister', data);
          if (typeof data.body.registerStatus !== 'string') return;
          resolve({
            ...data.body,
            status: data.body.registerStatus,
            message: data.body.registerMessage,
          });
          remove();
        },
      );
    } else {
      const { remove } = Socket.onCaAccountRecover(
        {
          clientId,
          requestId: requestId,
        },
        data => {
          console.log('onCaAccountRecover', data);

          resolve({
            ...data.body,
            status: data.body.recoveryStatus,
            message: data.body.recoveryMessage,
          });

          remove();
        },
      );
    }
  });
};

interface FetchCreateWalletParams {
  baseURL?: string;
  verificationType: VerificationType;
  managerUniqueId: string;
}

export const getWalletCAAddressByApi = async (params: FetchCreateWalletParams): Promise<CreateWalletResult> => {
  const result = await requestCreateWallet(params);
  console.log(result, 'result===getWalletCAAddressByApi');
  if (!result || result.recoveryStatus === 'pending' || result.registerStatus === 'pending') {
    await sleep(2000);
    return getWalletCAAddressByApi(params);
  } else {
    return {
      ...result,
      status: result.recoveryStatus || result.registerStatus,
      message: result.recoveryMessage || result.registerMessage,
    };
  }
};

interface GetSocketResultParams {
  clientId: string;
  requestId: string;
  verificationType: VerificationType;
}

export const useFetchWalletCAAddress = () => {
  const apiUrl = useCurrentApiUrl();

  const fetch = useCallback(
    async (
      params: GetSocketResultParams & FetchCreateWalletParams,
    ): Promise<CreateWalletResult & { Socket: typeof Socket }> => {
      return new Promise(resolve => {
        getCreateResultBySocket({
          type: params.verificationType,
          apiUrl,
          clientId: params.clientId,
          requestId: params.requestId,
        }).then(result => resolve({ ...result, Socket }));

        getWalletCAAddressByApi({
          verificationType: params.verificationType,
          managerUniqueId: params.managerUniqueId,
        }).then(result => resolve({ ...result, Socket }));
      });
    },
    [apiUrl],
  );

  return fetch;
};
