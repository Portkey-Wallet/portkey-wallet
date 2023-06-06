import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { handleErrorMessage } from '@portkey-wallet/utils';
import aes from '@portkey-wallet/utils/aes';
import { Button, message } from 'antd';
import usePromptSearch from 'hooks/usePromptSearch';
import { useCallback } from 'react';
import { useUserInfo } from 'store/Provider/hooks';
import errorHandler from 'utils/errorHandler';
import { closePrompt } from 'utils/lib/serviceWorkerAction';
import { callSendMethod } from 'utils/sandboxUtil/sendTransactions';

export default function SendTransactions() {
  const detail = usePromptSearch<{
    payload: {
      chainId: ChainId;
      contractAddress: string;
      method: string;
      params: any;
    };
  }>();
  const chainInfo = useCurrentChain(detail?.payload?.chainId);
  const wallet = useCurrentWalletInfo();
  const { passwordSeed } = useUserInfo();

  const sendHandler = useCallback(async () => {
    try {
      if (!chainInfo?.endPoint || !wallet?.caHash) {
        closePrompt({ ...errorHandler(400001), data: { code: 4002, msg: 'invalid chain id' } });
        return;
      }
      const { payload } = detail;
      const isCAManagerForwardCall = chainInfo.caContractAddress !== payload.contractAddress;
      let paramsOption = payload.params?.paramsOption;

      const functionName = isCAManagerForwardCall ? 'ManagerForwardCall' : payload.method;

      paramsOption = isCAManagerForwardCall
        ? {
            caHash: wallet.caHash,
            methodName: payload.method,
            contractAddress: payload.contractAddress,
            args: paramsOption,
          }
        : paramsOption;
      const privateKey = aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed);
      if (!privateKey) throw 'Invalid user information, please check';
      const result = await callSendMethod({
        rpcUrl: chainInfo.endPoint,
        chainType: 'aelf',
        methodName: functionName,
        paramsOption,
        privateKey,
        address: chainInfo.caContractAddress,
        sendOptions: { onMethod: 'transactionHash' },
      });
      closePrompt({
        ...errorHandler(0),
        data: result.result,
      });
    } catch (error) {
      console.error(error, 'error===detail');
      message.error(handleErrorMessage(error));
    }
  }, [chainInfo, detail, wallet, passwordSeed]);

  return (
    <div>
      {JSON.stringify(detail)}
      <Button
        onClick={() => {
          closePrompt(errorHandler(200003));
        }}>
        cancel
      </Button>
      <Button onClick={sendHandler}>Approve</Button>
    </div>
  );
}
