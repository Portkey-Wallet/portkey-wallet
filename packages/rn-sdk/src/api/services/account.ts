import { UnlockedWallet } from 'api/types';
import { IAccountService } from 'api/types/account';
import { injectable } from 'inversify';
import { BaseService } from '.';
import { LoginResult } from 'model/verify/entry';
import { PortkeyEntries } from 'config/entries';
import { AccountError } from 'api/error';
import { callRemoveManagerMethod } from 'model/contract/handler';
import { exitWallet as exitInternalWallet, lockWallet as lockInternalWallet } from 'model/verify/core';
import { CheckPinResult } from 'pages/Pin/CheckPin';
import { CheckWalletLocked, CheckWalletUnlocked, HANDLE_WAY } from 'api/decorate';
import resetStore from 'store/resetStore';
@injectable()
export class AccountService extends BaseService implements IAccountService {
  login(): Promise<UnlockedWallet | null> {
    return new Promise((resolve, reject) => {
      this.openResultFromExternal<LoginResult>(PortkeyEntries.SIGN_IN_ENTRY, async res => {
        if (res) {
          resolve(res?.data?.walletInfo ?? null);
        } else {
          reject(new AccountError(1004));
        }
      });
    });
  }

  @CheckWalletUnlocked({ way: HANDLE_WAY.RETURN_FALSE })
  async exitWallet() {
    try {
      const res = await callRemoveManagerMethod();
      if (!res.error) {
        exitInternalWallet();
        resetStore();
      } else {
        console.warn('exitWallet', JSON.stringify(res.error));
        return false;
      }
      return true;
    } catch (e: any) {
      throw new AccountError(9999, e?.message || e);
    }
  }

  @CheckWalletUnlocked({ way: HANDLE_WAY.RETURN_FALSE })
  async lockWallet() {
    await lockInternalWallet();
    return true;
  }

  @CheckWalletLocked({ way: HANDLE_WAY.THROW_ERROR })
  async unlockWallet(): Promise<UnlockedWallet | null> {
    return new Promise((resolve, reject) => {
      this.openResultFromExternal<CheckPinResult>(PortkeyEntries.CHECK_PIN, res => {
        if (res) {
          resolve(res.data?.walletInfo ?? null);
        } else {
          reject(new AccountError(1003));
        }
      });
    });
  }
}
