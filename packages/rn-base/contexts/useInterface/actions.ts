import { ChainId } from '@portkey-wallet/types';
import { AElfChainMethods } from '@portkey-wallet/types/aelf';
import { basicActions } from '../utils';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { State } from './types';

export enum InterfaceActions {
  setCurrentInterface = 'setCurrentInterface',
  setViewContracts = 'setViewContracts',
  setViewContract = 'setViewContract',
  setCAContract = 'setCAContract',
  setTokenContract = 'setTokenContract',
  destroy = 'DESTROY',
}

export const basicInterfaceActions = {
  setCurrentInterface: (currentInterface: AElfChainMethods) =>
    basicActions(InterfaceActions.setCurrentInterface, { currentInterface }),
  setViewContracts: (viewContracts: State['viewContracts']) =>
    basicActions(InterfaceActions.setViewContracts, { viewContracts }),
  setViewContract: (viewContract: State['viewContracts']) =>
    basicActions(InterfaceActions.setViewContract, { viewContract }),
  setCAContract: (caContract: { [key: string]: ContractBasic }, chainId: ChainId) =>
    basicActions(InterfaceActions.setCAContract, { caContract, chainId }),
  setTokenContract: (tokenContract: { [key: string]: ContractBasic }, chainId: ChainId) =>
    basicActions(InterfaceActions.setTokenContract, { tokenContract, chainId }),
  interfaceDestroy: () => basicActions(InterfaceActions.destroy),
};

export const {
  interfaceDestroy,
  setCurrentInterface,
  setViewContracts,
  setViewContract,
  setCAContract,
  setTokenContract,
} = basicInterfaceActions;
