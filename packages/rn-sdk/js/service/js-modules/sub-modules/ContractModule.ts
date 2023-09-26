import { portkeyModulesEntity } from '../../native-modules';

const ContractModule = {
  callContractMethod: <In>(eventId: string, contractName: string, methodName: string, params?: Partial<In>) => {
    portkeyModulesEntity.NativeWrapperModule.emitJSMethodResult(
      eventId,
      JSON.stringify({
        contractName,
        methodName,
        params,
      }),
    );
  },
};

export default ContractModule;
