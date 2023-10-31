import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import { WalletModule } from '../SubModules/WalletModule';

enum JSModuleIdentifier {
  WALLET_MODULE = 'WalletModule',
}

const jsModuleEntries: { [key: string]: object } = {
  [JSModuleIdentifier.WALLET_MODULE]: WalletModule,
};

export const initJSBatchedBridgeModules = () => {
  Object.entries(jsModuleEntries).forEach(([key, value]) => {
    BatchedBridge.registerCallableModule(key, value);
  });
};
