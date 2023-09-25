const ContractModule = {
  callContractMethod: <In>(contractName: string, methodName: string, params?: Partial<In>): any => {
    return 'hello contract';
  },
};

export default ContractModule;
