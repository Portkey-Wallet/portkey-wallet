import { sleep } from '@portkey-wallet/utils';
import { PortkeyModulesEntity } from '../../native-modules';

const ContractModule = {
  callContractMethod: async (contractName: string, methodName: string, data: any, eventId: string) => {
    await sleep(1000);
    console.warn('callContractMethod called.');
    PortkeyModulesEntity.NativeWrapperModule.onWarning('callContractMethod', 'callContractMethod called.');
    PortkeyModulesEntity.NativeWrapperModule.emitJSMethodResult(
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
