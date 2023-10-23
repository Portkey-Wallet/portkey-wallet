import { sleep } from '@portkey-wallet/utils';
import { portkeyModulesEntity } from '../../native-modules';

const ContractModule = {
  callContractMethod: async (contractName: string, methodName: string, data: any, eventId: string) => {
    await sleep(1000);
    console.warn('callContractMethod called.');
    portkeyModulesEntity.NativeWrapperModule.onWarning('callContractMethod', 'callContractMethod called.');
    portkeyModulesEntity.NativeWrapperModule.emitJSMethodResult(
      eventId,
      JSON.stringify({
        params: {
          contractName,
          methodName,
          data,
          eventId,
        },
      }),
    );
  },
};

export default ContractModule;
