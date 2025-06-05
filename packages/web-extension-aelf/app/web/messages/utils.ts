import { WalletMessageType } from './InternalMessageTypes';
import walletMessage from './walletMessage';

export function isMethodsWalletMessage(method: string): method is WalletMessageType {
  return Object.values(walletMessage).indexOf(method as any) !== -1;
}
