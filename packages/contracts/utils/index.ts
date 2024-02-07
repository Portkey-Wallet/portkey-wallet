import { AElfInterface, AElfWallet } from '@portkey-wallet/types/aelf';
import { ContractBasic } from './ContractBasic';
import AElf from 'aelf-sdk';
import { getAelfInstance } from '@portkey-wallet/utils/aelf';
import { sleep } from '@portkey-wallet/utils';

const methodsMap: { [key: string]: any } = {};

const contractMap: { [key: string]: ContractBasic } = {};

export async function getContractBasic({
  contractAddress,
  aelfInstance,
  account,
  rpcUrl,
}: {
  rpcUrl?: string;
  contractAddress: string;
  aelfInstance?: AElfInterface;
  account: { address: string } | AElfWallet;
}) {
  let instance = aelfInstance;
  if (rpcUrl) instance = getAelfInstance(rpcUrl);
  if (!instance) throw new Error('Get instance error');
  const key = contractAddress + account.address + instance.currentProvider.host;
  if (!contractMap[key]) {
    const aelfContract = await instance.chain.contractAt(contractAddress, account);
    contractMap[key] = new ContractBasic({
      aelfContract,
      contractAddress,
      aelfInstance: instance,
      rpcUrl: instance.currentProvider.host,
    });
  }
  return contractMap[key];
}

class TXError extends Error {
  public TransactionId?: string;
  public transactionId?: string;
  constructor(message: string, id?: string) {
    super(message);
    this.TransactionId = id;
    this.transactionId = id;
  }
}

export function handleContractErrorMessage(error?: any) {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error.Error) {
    return error.Error.Details || error.Error.Message || error.Error || error.Status;
  }
  return `Transaction: ${error.Status}`;
}

export async function getTxResult(
  instance: any,
  TransactionId: string,
  reGetCount = 0,
  notExistedReGetCount = 0,
): Promise<any> {
  const txFun = instance.chain.getTxResult;
  let txResult;
  try {
    txResult = await txFun(TransactionId);
  } catch (error) {
    throw new TXError(handleContractErrorMessage(error), TransactionId);
  }

  // For nightELF compatibility
  if (txResult.error && txResult.errorMessage) {
    throw new TXError(txResult.errorMessage.message || txResult.errorMessage.Message, TransactionId);
  }

  const result = txResult?.result || txResult;
  if (!result) throw new TXError('Can not get transaction result.', TransactionId);
  const lowerCaseStatus = result.Status.toLowerCase();
  if (lowerCaseStatus === 'notexisted') {
    if (notExistedReGetCount > 5) throw new TXError(result.Error || `Transaction: ${result.Status}`, TransactionId);
    await sleep(1000);
    notExistedReGetCount++;
    reGetCount++;
    return getTxResult(instance, TransactionId, reGetCount, notExistedReGetCount);
  }
  if (lowerCaseStatus === 'pending' || lowerCaseStatus === 'pending_validation') {
    if (reGetCount > 20) throw new TXError(result.Error || `Transaction: ${result.Status}`, TransactionId);
    await sleep(1000);
    reGetCount++;
    return getTxResult(instance, TransactionId, reGetCount, notExistedReGetCount);
  }
  if (lowerCaseStatus === 'mined') return result;
  throw new TXError(result.Error || `Transaction: ${result.Status}`, TransactionId);
}

export function handleContractError(error?: any, req?: any) {
  if (typeof error === 'string') return { message: error };
  if (error?.message) return error;
  if (error.Error) {
    return {
      message: error.Error.Details || error.Error.Message || error.Error || error.Status,
      code: error.Error.Code,
    };
  }
  return {
    code: req?.error?.message?.Code || req?.error,
    message: req?.errorMessage?.message || req?.error?.message?.Message,
  };
}

export function handleFunctionName(functionName: string) {
  return functionName.replace(functionName[0], functionName[0].toLocaleUpperCase());
}

export const getServicesFromFileDescriptors = (descriptors: any) => {
  const root = AElf.pbjs.Root.fromDescriptor(descriptors, 'proto3').resolveAll();
  return descriptors.file
    .filter((f: { service: string | any[] }) => f.service.length > 0)
    .map((f: { service: { name: any }[]; package: any }) => {
      const sn = f.service[0].name;
      const fullName = f.package ? `${f.package}.${sn}` : sn;
      return root.lookupService(fullName);
    });
};

export const getFileDescriptorsSet = async (instance: any, contractAddress: string) => {
  const fds = await instance.chain.getContractFileDescriptorSet(contractAddress);
  return getServicesFromFileDescriptors(fds);
};

export async function getContractMethods(instance: any, address: any) {
  const key = instance.currentProvider.host + address;
  if (!methodsMap[key]) {
    const methods = await getFileDescriptorsSet(instance, address);
    const _obj: any = {};
    Object.keys(methods).forEach(key => {
      const service = methods[key];
      Object.keys(service.methods).forEach(key => {
        const method = service.methods[key].resolve();
        _obj[method.name] = method.resolvedRequestType;
      });
    });
    methodsMap[key] = _obj;
  }
  return methodsMap[key];
}

export const encodedParams = async (inputType: any, params: any) => {
  let input = AElf.utils.transform.transformMapToArray(inputType, params);

  input = AElf.utils.transform.transform(inputType, input, AElf.utils.transform.INPUT_TRANSFORMERS);

  const message = inputType.fromObject(input);
  return inputType.encode(message).finish();
};

type HandleContractParamsParams = { paramsOption: any; functionName: string; instance: any };

export const handleContractParams = async ({ paramsOption, functionName, instance }: HandleContractParamsParams) => {
  if (functionName === 'ManagerForwardCall') {
    const { contractAddress, methodName, args, caHash } = paramsOption || {};
    if (!(contractAddress && methodName && caHash)) {
      throw new Error('ManagerForwardCall parameter is missing');
    }
    const methods = await getContractMethods(instance, paramsOption.contractAddress);
    const inputType = methods[paramsOption.methodName];
    if (!inputType) throw new Error(`Contract ${contractAddress} does not exist ${methodName}`);
    const _args = await encodedParams(inputType, args);
    return {
      ...paramsOption,
      args: _args,
    };
  }
  return paramsOption;
};
