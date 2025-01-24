import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';

export type TSendLimitParams = {
  contract: ContractBasic;
  managerAddress: string;
  caHash: string;
  contractAddress: string;
  args: {
    amountIn: string;
    symbolIn: string;
    amountOut: string;
    symbolOut: string;
    deadline: {
      seconds: number;
      nanos: number;
    };
  };
};

export const sendLimit = async ({ contract, managerAddress, contractAddress, caHash, args }: TSendLimitParams) => {
  const methodName = 'CommitLimitOrder';
  const result = await contract.callSendMethod('ManagerForwardCall', managerAddress, {
    caHash,
    contractAddress,
    methodName,
    args,
  });
  if (result.error) {
    throw result.error;
  }
  return result;
};

export type TSendEOALimitParams = {
  contract: ContractBasic;
  address: string;
  args: {
    amountIn: string;
    symbolIn: string;
    amountOut: string;
    symbolOut: string;
    deadline: {
      seconds: number;
      nanos: number;
    };
  };
};
export const sendEOALimit = async ({ contract, address, args }: TSendEOALimitParams) => {
  const result = await contract.callSendMethod('CommitLimitOrder', address, args);
  if (result.error) {
    throw result.error;
  }
  return result;
};
