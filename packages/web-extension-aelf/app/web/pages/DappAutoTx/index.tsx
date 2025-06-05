import CustomSvg from 'components/CustomSvg';
import usePromptSearch from 'hooks/usePromptSearch';
import { useCallback } from 'react';
import { closePrompt } from 'utils/lib/serviceWorkerAction';
import errorHandler from 'utils/errorHandler';
import { MethodsBase, ResponseCode } from '@portkey/provider-types';
import { getLocalStorage } from 'utils/storage/chromeStorage';
import { callSendMethod } from 'utils/sandboxUtil/sendTransactions';
import { Loading } from '@portkey/did-ui-react';
import { apis } from 'utils/BrowserApis';
import { useEffectOnce, useThrottleCallback } from '@portkey-wallet/hooks';
import { getChainInfo, getCurrentWallet } from 'store/utils/getStore';
import getSeed from 'utils/getSeed';
import './index.less';

export default function DappAutoTx() {
  const txParams = usePromptSearch<any>();
  const { payload } = txParams;
  const handleTransaction = useThrottleCallback(async () => {
    const wallet = getCurrentWallet();
    const chainInfo = getChainInfo(payload.chainId);
    const isCAContract = chainInfo?.caContractAddress === payload?.contractAddress;

    const curWindow = await apis.windows.getCurrent();
    try {
      if (!chainInfo?.endPoint || !wallet?.caHash) {
        closePrompt({
          ...errorHandler(400001),
          data: { code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid chain id', windowId: curWindow.id },
        });
        return;
      }

      if (chainInfo?.endPoint !== payload?.rpcUrl) {
        closePrompt({
          ...errorHandler(400001),
          data: { code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid rpcUrl', windowId: curWindow.id },
        });
        return;
      }

      const { privateKey } = await getSeed();

      if (!privateKey) throw 'Invalid user information, please check';

      const txPayload = await getLocalStorage<{ [x: string]: any }>('txPayload');
      const { transactionInfoId } = txParams;
      if (!txPayload[transactionInfoId]) {
        closePrompt({
          ...errorHandler(400001),
          data: { code: ResponseCode.ERROR_IN_PARAMS },
          windowId: curWindow.id,
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
        windowId: curWindow.id,
      });
    } catch (error) {
      console.error(error, 'error===detail');
      closePrompt({
        ...errorHandler(400001),
        data: { code: ResponseCode.ERROR_IN_PARAMS, msg: error },
        windowId: curWindow.id,
      });
    }
  }, [payload.chainId, payload?.contractAddress, payload?.rpcUrl, payload?.method, txParams]);

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

  useEffectOnce(() => {
    executeFn();
  });

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
