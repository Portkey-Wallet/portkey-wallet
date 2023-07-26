import CustomSvg from 'components/CustomSvg';
import usePromptSearch from 'hooks/usePromptSearch';
import { useCallback, useEffect, useMemo } from 'react';
import { closePrompt } from 'utils/lib/serviceWorkerAction';
import errorHandler from 'utils/errorHandler';
import { MethodsBase, ResponseCode } from '@portkey/provider-types';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getLocalStorage } from 'utils/storage/chromeStorage';
import aes from '@portkey-wallet/utils/aes';
import { useUserInfo } from 'store/Provider/hooks';
import { callSendMethod } from 'utils/sandboxUtil/sendTransactions';
import { Loading } from '@portkey/did-ui-react';
import './index.less';

export default function DappAutoTx() {
  const txParams = usePromptSearch<any>();
  const { payload } = txParams;
  const chainInfo = useCurrentChain(payload?.chainId);
  const wallet = useCurrentWalletInfo();
  const isCAContract = useMemo(() => chainInfo?.caContractAddress === payload?.contractAddress, [chainInfo, payload]);
  const { passwordSeed } = useUserInfo();
  const privateKey = useMemo(
    () => aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed),
    [passwordSeed, wallet.AESEncryptPrivateKey],
  );
  const handleTransaction = useCallback(async () => {
    try {
      if (!chainInfo?.endPoint || !wallet?.caHash) {
        closePrompt({ ...errorHandler(400001), data: { code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid chain id' } });
        return;
      }

      if (chainInfo?.endPoint !== payload?.rpcUrl) {
        closePrompt({ ...errorHandler(400001), data: { code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid rpcUrl' } });
        return;
      }

      const txPayload = await getLocalStorage<{ [x: string]: any }>('txPayload');
      const { transactionInfoId } = txParams;
      if (!txPayload[transactionInfoId]) {
        closePrompt({
          ...errorHandler(400001),
          data: { code: ResponseCode.ERROR_IN_PARAMS },
        });
        return;
      }

      const transactionInfo = JSON.parse(txPayload[transactionInfoId]);
      let paramsOption = transactionInfo.paramsOption;

      const functionName = isCAContract ? payload?.method : 'ManagerForwardCall';

      paramsOption = isCAContract
        ? paramsOption
        : {
            caHash: wallet.caHash,
            methodName: payload?.method,
            contractAddress: payload?.contractAddress,
            args: paramsOption,
          };
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
      closePrompt({
        ...errorHandler(400001),
        data: { code: ResponseCode.ERROR_IN_PARAMS },
      });
    }
  }, [chainInfo, wallet, payload, txParams, isCAContract, privateKey]);

  const executeFn = useCallback(() => {
    switch (txParams.method) {
      case MethodsBase.SEND_TRANSACTION:
        return handleTransaction();
      default:
        return () => {
          closePrompt({
            ...errorHandler(0),
            data: 'default',
          });
        };
    }
  }, [handleTransaction, txParams.method]);

  useEffect(() => {
    executeFn();
  }, [executeFn]);

  return (
    <div className="auto-tx flex-column-center">
      <div className="auto-title flex-center">
        <CustomSvg type="PortKey" />
        <span>PORTKEY</span>
      </div>
      <div className="loading">
        <Loading />
      </div>
      <div className="content">
        <span>The transaction is being automatically processed, please </span>
        <span className="high-light">DO NOT</span>
        <span> close the window.</span>
      </div>
      <span className="tip">{`Please allow this window to close on its own upon transaction completion. Manually closing it could result in termination of the transaction or potential errors.`}</span>
    </div>
  );
}
