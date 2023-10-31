import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import { WalletModule } from '../SubModules/WalletModule';

enum JSModuleIdentifier {
  CONTRACT_MODULE = 'ContractModule',
}

const jsModuleEntries: { [key: string]: object } = {
  [JSModuleIdentifier.CONTRACT_MODULE]: WalletModule,
};

export const initJSBatchedBridgeModules = () => {
  Object.entries(jsModuleEntries).forEach(([key, value]) => {
    BatchedBridge.registerCallableModule(key, value);
  });
};
