import { CAInfo, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { clearTimeoutInterval, setTimeoutInterval } from '@portkey-wallet/utils/interval';

import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { request } from '@portkey-wallet/api/api-did';
import socket from '@portkey-wallet/socket/socket-did';
import { LoginQRData } from '@portkey-wallet/types/types-ca/qrcode';
import { contractQueries } from '@portkey-wallet/graphql';
import { getCurrentCAViewContract, getWallet } from './redux';
import { ChainId } from '@portkey-wallet/types';
import { SendOptions } from '@portkey-wallet/contracts/types';

export type TimerResult = {
  remove: () => void;
};

export type IntervalGetResultParams = {
  managerInfo: ManagerInfo;
  onPass?: (caInfo: CAInfo) => void;
  onFail?: (message: string) => void;
};

export function intervalGetResult({ managerInfo, onPass, onFail }: IntervalGetResultParams) {
  let timer = '',
    mark = false;
  const listenerList: TimerResult[] = [];
  const remove = () => {
    try {
      timer && clearTimeoutInterval(timer);
      listenerList.forEach(listen => listen.remove());
      socket.stop();
    } catch (error) {
      console.debug(error);
    }
  };

  const distributeFail = async (message: string) => {
    try {
      if (message.includes('ManagerInfo exists')) {
        const wallet = getWallet();
        const address = wallet?.walletInfo?.address || '';
        const { caHolderManagerInfo } = await contractQueries.getCAHolderByManager(wallet.currentNetwork, {
          manager: wallet?.walletInfo?.address || '',
        });
        const info = caHolderManagerInfo[0];
        if (!info.originChainId) throw new Error('caHolderManagerInfo is empty');
        const caContract = await getCurrentCAViewContract(info.originChainId as ChainId);
        const contractInfo = await caContract?.callViewMethod('GetHolderInfo', { caHash: info.caHash });
        const { managerInfos, caAddress, caHash } = contractInfo?.data;
        const exist = await managerInfos?.some((manager: { address: string }) => manager?.address === address);
        if (exist) return onPass?.({ caAddress, caHash });
      }
    } catch {}
    onFail?.(message);
  };
  const sendResult = (result: any) => {
    if (mark) return;
    switch (result.recoveryStatus || result.registerStatus) {
      case 'pass': {
        if (result.caAddress && result.caHash) {
          onPass?.(result);
          remove();
          mark = true;
        }
        break;
      }
      case 'fail': {
        distributeFail(result.recoveryMessage || result.registerMessage);
        remove();
        mark = true;
        break;
      }
      default:
        break;
    }
  };
  const clientId = managerInfo.clientId || '';
  const requestId = managerInfo.requestId || '';
  socket.doOpen({
    url: `${request.defaultConfig.baseURL}/ca`,
    clientId,
  });
  let fetch: any;
  if (managerInfo.verificationType !== VerificationType.register) {
    fetch = request.es.getRecoverResult;
    listenerList.push(
      socket.onCaAccountRecover({ clientId, requestId }, data => {
        sendResult(data.body);
      }),
    );
  } else {
    fetch = request.es.getRegisterResult;
    listenerList.push(
      socket.onCaAccountRegister({ clientId, requestId }, data => {
        sendResult(data.body);
      }),
    );
  }
  timer = setTimeoutInterval(async () => {
    try {
      const req = await fetch({
        params: { filter: `_id:${managerInfo.managerUniqueId}` },
      });
      sendResult(req.items[0]);
    } catch (error) {
      console.debug(error, '=====error');
    }
  }, 3000);
  return { remove };
}

export async function addManager({
  contract,
  address,
  caHash,
  managerAddress,
  extraData,
  sendOptions,
}: {
  contract: ContractBasic;
  address: string;
  caHash: string;
  managerAddress?: LoginQRData['address'];
  extraData?: string;
  sendOptions?: SendOptions;
}) {
  return contract.callSendMethod(
    'AddManagerInfo',
    address,
    {
      caHash,
      managerInfo: {
        address: managerAddress,
        extraData: extraData || '',
      },
    },
    sendOptions,
  );
}
