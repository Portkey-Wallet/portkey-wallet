import { UnlockedWallet } from './';

export interface IAccountService {
  login(): Promise<UnlockedWallet | null>;
  exitWallet(): Promise<boolean>;
  lockWallet(): Promise<boolean>;
  unlockWallet(): Promise<UnlockedWallet | null>;
}
