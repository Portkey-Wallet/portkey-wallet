import { SendResult, ViewResult } from '@portkey-wallet/contracts/types';
import { PortkeyModulesEntity } from '../../native-modules';
import { BaseJSModule, BaseMethodParams, BaseMethodResult } from '../types';
import { callRemoveManagerMethod, getCAContractInstance } from 'model/contract/handler';
import { exitWallet, isWalletUnlocked, lockWallet } from 'model/verify/core';
import { getUnlockedWallet } from 'model/wallet';
import resetStore from 'store/resetStore';

const WalletModule: BaseJSModule = {
  callCaContractMethod: async (props: CallCaMethodProps) => {
    const { eventId = '', contractMethodName: methodName, params, isViewMethod } = props;
    console.log('callContractMethod called ', 'eventId: ', eventId, 'methodName: ', methodName, 'params: ', params);
    if (!(await isWalletUnlocked())) {
      return emitJSMethodResult(eventId, {
        status: 'fail',
        error: 'wallet is not unlocked',
      });
    }
    const contract = await getCAContractInstance();
    const { address } = await getUnlockedWallet();
    const isParamsEmpty = Object.values(params ?? {}).length === 0;
    try {
      const result: ViewResult | SendResult = isViewMethod
        ? await contract.callViewMethod(methodName, isParamsEmpty ? '' : params)
        : await contract.callSendMethod(methodName, address, isParamsEmpty ? '' : params);
      if (!result) throw new Error('result is null');
      const { data, error } = result;
      let jsData: BaseMethodResult = {
        status: !error ? 'success' : 'fail',
        data,
        error,
      };
      if ((result as any).transactionId) {
        jsData = {
          ...jsData,
          transactionId: (result as any).transactionId,
        };
      }
      emitJSMethodResult(eventId, jsData);
    } catch (e) {
      emitJSMethodResult(eventId, {
        status: 'fail',
        error: e,
      });
    }
  },

  getWalletDetails: async (props: BaseMethodParams) => {
    const { eventId = '' } = props;
    console.log('getWalletDetails called ', 'eventId: ', eventId);
    if (!(await isWalletUnlocked())) {
      return emitJSMethodResult(eventId, {
        status: 'fail',
        error: 'wallet is not unlocked!',
      });
    }
    const wallet = await getUnlockedWallet();
    return emitJSMethodResult(eventId, {
      status: 'success',
      data: wallet,
    });
  },

  lockWallet: async (props: BaseMethodParams) => {
    const { eventId = '' } = props;
    console.log('lockWallet called ', 'eventId: ', eventId);
    if (!(await isWalletUnlocked())) {
      return emitJSMethodResult(eventId, {
        status: 'fail',
        error: 'wallet is not unlocked! You have to unlock wallet before trying to lock.',
      });
    }
    await lockWallet();
    return emitJSMethodResult(eventId, {
      status: 'success',
      data: { succeed: true },
    });
  },

  exitWallet: async (props: BaseMethodParams) => {
    const { eventId = '' } = props;
    console.log('exitWallet called ', 'eventId: ', eventId);
    if (!(await isWalletUnlocked())) {
      return emitJSMethodResult(eventId, {
        status: 'fail',
        error: 'wallet is not unlocked or created! You have to unlock wallet before trying to exit.',
      });
    }
    try {
      const res = await callRemoveManagerMethod();
      if (!res.error) {
        resetStore();
        exitWallet();
      } else {
        throw res.error;
      }
      return emitJSMethodResult(eventId, {
        status: !res.error ? 'success' : 'fail',
        data: { result: res.data },
      });
    } catch (e) {
      console.error('error when callRemoveManagerMethod', e);
      return emitJSMethodResult(eventId, {
        status: 'fail',
        error: e,
      });
    }
  },
};

export const emitJSMethodResult = (eventId: string, result: BaseMethodResult) => {
  PortkeyModulesEntity.NativeWrapperModule.onWarning(
    'emitJSMethodResult',
    `emitJSMethodResult called, eventId: ${eventId}, result: ${JSON.stringify(result)}`,
  );
  PortkeyModulesEntity.NativeWrapperModule.emitJSMethodResult(eventId, JSON.stringify(result));
};

export interface CallCaMethodProps extends BaseMethodParams {
  contractMethodName: string;
  isViewMethod: boolean;
  params?: { [key: string | symbol]: any };
}

export { WalletModule };
