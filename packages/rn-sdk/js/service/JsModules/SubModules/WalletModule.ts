import { sleep } from '@portkey-wallet/utils';
import { PortkeyModulesEntity } from '../../native-modules';
import { BaseJSModule, BaseMethodParams } from '../types';

const WalletModule: BaseJSModule = {
  callContractMethod: async ({ eventId }: BaseMethodParams) => {
    await sleep(1000);
    console.warn('callContractMethod called.');
    PortkeyModulesEntity.NativeWrapperModule.onWarning('callContractMethod', 'callContractMethod called.');
    PortkeyModulesEntity.NativeWrapperModule.emitJSMethodResult(
      eventId,
      JSON.stringify({
        data: { 'i-am-a': 'mock-result' },
      }),
    );
  },
};

export { WalletModule };
