import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import ContractModule from './sub-modules/ContractModule';

enum JSModuleIdentifier {
  CONTRACT_MODULE = 'ContractModule',
}

const jsModuleEntries: { [key: string]: object } = {
  [JSModuleIdentifier.CONTRACT_MODULE]: ContractModule,
};

export const initJSModules = () => {
  Object.entries(jsModuleEntries).forEach(([key, value]) => {
    BatchedBridge.registerCallableModule(key, value);
  });
};
