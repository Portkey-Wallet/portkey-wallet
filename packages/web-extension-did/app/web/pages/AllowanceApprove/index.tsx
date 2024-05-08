import { useCurrentCaHash, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import usePromptSearch from 'hooks/usePromptSearch';
import singleMessage from 'utils/singleMessage';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { closeTabPrompt } from 'utils/lib/serviceWorkerAction';
import errorHandler from 'utils/errorHandler';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ResponseCode } from '@portkey/provider-types';
import { ApproveMethod } from '@portkey-wallet/constants/constants-ca/dapp';
import { getLocalStorage } from 'utils/storage/chromeStorage';
import { useCheckManagerSyncState } from 'hooks/wallet';
import { ChainId } from '@portkey-wallet/types';
import { IGuardiansApproved } from '@portkey/did-ui-react';
import ManagerApproveInner from './ManagerApproveInner';
import getSeed from 'utils/getSeed';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-ca/network';
import './index.less';

export default function AllowanceApprove() {
  const { origin, chainId, icon, method, transactionInfoId } = usePromptSearch<{
    origin: string;
    transactionInfoId: string;
    icon: string;
    method: string;
    chainId: ChainId;
  }>();
  const caHash = useCurrentCaHash();
  const originChainId = useOriginChainId();
  const chainInfo = useCurrentChain(chainId);
  const currentNetwork = useCurrentNetwork();

  const [txParams, setTxParams] = useState<any>();

  console.log(txParams, '===txParams');

  const privateKeyRef = useRef<string>('');

  const getInitState = useCallback(async () => {
    const { privateKey } = await getSeed();
    if (!privateKey) return;
    privateKeyRef.current = privateKey;
  }, []);

  useEffect(() => {
    getInitState();
  }, [getInitState]);

  const onFinish = useDebounceCallback(
    async ({
      amount,
      guardiansApproved,
      batchApproveToken,
    }: {
      amount: string;
      guardiansApproved: IGuardiansApproved[];
      batchApproveToken: boolean;
    }) => {
      try {
        if (!txParams) throw Error('invalid params(txParams)');
        if (method !== ApproveMethod.token && method !== ApproveMethod.ca) throw 'Please check method';
        if (!privateKeyRef.current) throw 'Invalid user information, please check';

        if (!chainInfo?.endPoint || !caHash) {
          closeTabPrompt({
            ...errorHandler(400001),
            data: { code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid params' },
          });
          return;
        }
        if (chainInfo?.endPoint !== txParams?.rpcUrl) {
          closeTabPrompt({
            ...errorHandler(400001),
            data: { code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid rpcUrl' },
          });
          return;
        }
        const contract = await new ExtensionContractBasic({
          privateKey: privateKeyRef.current,
          rpcUrl: chainInfo.endPoint,
          contractAddress: chainInfo.caContractAddress,
        });

        const options = {
          caHash,
          spender: txParams.params.paramsOption.spender,
          symbol: batchApproveToken ? '*' : txParams.params.paramsOption.symbol,
          amount,
          guardiansApproved,
        };
        console.log(options, 'ManagerApprove==options====');
        const result = await contract.callSendMethod('ManagerApprove', '', options, {
          onMethod: 'transactionHash',
        });
        console.log(result, 'ManagerApprove==result====');
        closeTabPrompt({
          ...errorHandler(0),
          data: result.data,
        });
      } catch (error) {
        closeTabPrompt(errorHandler(700002, handleErrorMessage(error)));
      }
    },
    [caHash, chainInfo, method, txParams],
    500,
  );

  const checkManagerSyncState = useCheckManagerSyncState();
  const [, setIsManagerSynced] = useState(false);

  const getTxPayload = useCallback(async () => {
    const txPayload = await getLocalStorage<{ [x: string]: any }>('txPayload');

    if (!txPayload[transactionInfoId]) {
      closeTabPrompt({
        ...errorHandler(400001),
        data: { code: ResponseCode.ERROR_IN_PARAMS },
      });
      return;
    }
    const params = JSON.parse(txPayload[transactionInfoId]);

    setTxParams(params);
    const _isManagerSynced = await checkManagerSyncState(chainId);
    setIsManagerSynced(_isManagerSynced);
    if (_isManagerSynced) {
      // getFee(params);
      // setErrMsg('');
    } else {
      singleMessage.error('Synchronizing on-chain account information...', 10000);
    }
  }, [checkManagerSyncState, chainId, transactionInfoId]);

  useEffect(() => {
    getTxPayload();
  }, [getTxPayload]);

  return (
    <div className="manager-approve-page">
      {txParams && (
        <ManagerApproveInner
          networkType={currentNetwork}
          originChainId={originChainId}
          targetChainId={chainId}
          caHash={caHash || ''}
          amount={txParams.params.paramsOption.amount}
          symbol={txParams.params.paramsOption.symbol}
          dappInfo={{
            icon,
            href: origin,
            name: new URL(origin).hostname,
          }}
          onCancel={() => {
            closeTabPrompt(errorHandler(200003));
          }}
          onFinish={onFinish}
          onError={(error) => {
            singleMessage.error(handleErrorMessage(error));
          }}
        />
      )}
    </div>
  );
}
