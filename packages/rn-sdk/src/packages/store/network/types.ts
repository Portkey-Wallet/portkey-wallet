import { NetworkType } from 'packages/types';
import { ChainItemType } from 'packages/types/chain';

export interface ChainState {
  currentChain: ChainItemType;
  networkType: NetworkType;
  chainList: ChainItemType[];
  commonList: string[];
  rmCommonList: string[];
}

export enum ChainActionError {
  // network name
  nameHave = 'Name Already Exists',
  noName = 'Please Enter Network Name',
  nameMaxLength = 'The maximum size of the name is 50',
  hasName = 'Name Already Exists',
  // rpcurl
  hasRpcUrl = 'This URL is already added',
  rpcUrlAlreadyExists = 'This URL is already added',
  actionTypeError = 'Please Declare the Modification Type',
  notExist = 'Network does not Exist！',
  notSupported = 'Currently not Supported',
  noValue = 'Please enter New RPC URL',
  InvalidRpcUrl = 'Invalid RPC URL',
  // chainId
  noChainId = 'Please Enter Chain ID',
  chainIdError = 'Could not fetch chain ID. Is your RPC URL correct?',
  // blockExplorerURL
  invalidExplorerURL = 'Invalid Explorer URL',
}
