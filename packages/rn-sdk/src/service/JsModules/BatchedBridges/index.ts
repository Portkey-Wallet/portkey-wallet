import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import { WalletModule } from '../SubModules/WalletModule';
import { BaseJSModule } from '../types';

export enum JSModuleIdentifier {
  WALLET_MODULE = 'WalletModule',
  TEST_MODULE = 'TestModule',
}

export const JsModuleEntries: { [key: string]: BaseJSModule } = {
  [JSModuleIdentifier.WALLET_MODULE]: WalletModule,
};

/**
 * Init JS BatchedBridge Modules.
 *
 * this function is only used in iOS, since every setTimeout() or setInterval()'s callback will not be called in Android until the app is foreground.
 *
 * In Android, we use HeadlessJS to run background tasks.
 */
export const initJSBatchedBridgeModules = () => {
  Object.entries(JsModuleEntries).forEach(([key, value]) => {
    BatchedBridge.registerCallableModule(key, value);
  });
};
