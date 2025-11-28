import usePromptSearch from 'hooks/usePromptSearch';
import singleMessage from 'utils/singleMessage';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { closePrompt } from 'utils/lib/serviceWorkerAction';
import errorHandler from 'utils/errorHandler';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import { ResponseCode } from '@portkey/provider-types';
import { ApproveMethod } from '@portkey-wallet/constants/constants-eoa/dapp';
import { getLocalStorage } from 'utils/storage/chromeStorage';
import { ChainId } from '@portkey-wallet/types';
import ManagerApproveInner from './ManagerApproveInner';
import getSeed from 'utils/getSeed';
// import { useDebounceCallback } from '@portkey-wallet/hooks';
import './index.less';
import { useNetworkInfo } from 'store/Provider/hooks';

export default function AllowanceApprove() {
  const { origin, chainId, icon, method, transactionInfoId, batchApproveNFT } = usePromptSearch<{
    origin: string;
    transactionInfoId: string;
    icon: string;
    method: string;
    chainId: ChainId;
    batchApproveNFT: boolean;
  }>();
  const chainInfo = useCurrentChain(chainId);
  // const currentNetwork = useCurrentNetwork();
  const { currentNetwork } = useNetworkInfo();

  const [txParams, setTxParams] = useState<any>();

  const privateKeyRef = useRef<string>('');

  const getInitState = useCallback(async () => {
    const { privateKey } = await getSeed();
    if (!privateKey) return;
    privateKeyRef.current = privateKey;
  }, []);

  useEffect(() => {
    getInitState();
  }, [getInitState]);

  const onFinish = useCallback(
    async ({ amount, symbol }: { amount: string; symbol: string }) => {
      try {
        if (!txParams) throw Error('invalid params(txParams)');
        if (method !== ApproveMethod.token && method !== ApproveMethod.ca) throw 'Please check method';
        if (!privateKeyRef.current) throw 'Invalid user information, please check';

        console.log(txParams, 'Token Approve==txParams====');
        console.log(chainInfo, 'Token Approve==chainInfo====');
        if (!chainInfo?.endPoint) {
          await closePrompt({
            ...errorHandler(400001),
            data: { code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid params' },
          });
          return;
        }
        if (chainInfo?.endPoint !== txParams?.rpcUrl) {
          await closePrompt({
            ...errorHandler(400001),
            data: { code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid rpcUrl' },
          });
          return;
        }
        const contract = new ExtensionContractBasic({
          privateKey: privateKeyRef.current,
          rpcUrl: chainInfo.endPoint,
          contractAddress: chainInfo.defaultToken.address,
        });

        const options = {
          spender: txParams.params.paramsOption.spender,
          symbol,
          amount,
        };

        console.log(options, 'Token Approve==options====');
        const result = await contract.callSendMethod('Approve', '', options, {
          onMethod: 'transactionHash',
        });
        console.log(result, 'Token Approve==result====');
        closePrompt({
          ...errorHandler(0),
          data: result.data,
        });
      } catch (error) {
        console.log('onFinish error', error);
        closePrompt(errorHandler(700002, handleErrorMessage(error)));
      }
    },
    [chainInfo, method, txParams],
    // 500,
  );

  const getTxPayload = useCallback(async () => {
    const txPayload = await getLocalStorage<{ [x: string]: any }>('txPayload');

    if (!txPayload[transactionInfoId]) {
      closePrompt({
        ...errorHandler(400001),
        data: { code: ResponseCode.ERROR_IN_PARAMS },
      });
      return;
    }
    const params = JSON.parse(txPayload[transactionInfoId]);

    setTxParams(params);
  }, [transactionInfoId]);

  useEffect(() => {
    getTxPayload();
  }, [getTxPayload]);

  return (
    <>
      {txParams && (
        <ManagerApproveInner
          networkType={currentNetwork}
          // TODO: rm originChainId
          originChainId={'AELF'}
          spender={txParams?.params?.paramsOption?.spender}
          targetChainId={chainId}
          caHash={''}
          amount={txParams.params.paramsOption.amount}
          symbol={txParams.params.paramsOption.symbol}
          batchApproveNFT={batchApproveNFT}
          dappInfo={{
            icon,
            href: origin,
            name: new URL(origin).hostname,
          }}
          onCancel={() => {
            closePrompt(errorHandler(200003));
          }}
          onFinish={onFinish}
          onError={(error) => {
            singleMessage.error(handleErrorMessage(error));
          }}
        />
      )}
    </>
  );
}
