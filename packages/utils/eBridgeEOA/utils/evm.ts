import Web3 from 'web3';
import { AbiItem } from 'web3-utils/types';

export const getHttpProvider = (rpcUrl: string) => {
  return new Web3.providers.HttpProvider(rpcUrl);
};

export const getEVMContract = (rpcUrl: string, ABI: AbiItem, address: string) => {
  const web3 = new Web3(getHttpProvider(rpcUrl));
  const contract = new web3.eth.Contract(ABI, address);
  return contract;
};
