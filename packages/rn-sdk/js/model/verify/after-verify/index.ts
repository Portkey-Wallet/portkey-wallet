import { DeviceInfoType, DeviceType } from '@portkey-wallet/types/types-ca/device';
import { sleep } from '@portkey-wallet/utils';
import CommonToast from 'components/CommonToast';
import { requestSocialRecoveryOrRegister } from 'model/global';
import { NetworkController, handleRequestPolling } from 'network/controller';
import { CaInfo } from 'network/dto/guardian';
import { ProgressStatus, WalletInfo, isRecoveryStatusItem } from 'network/dto/wallet';
import { GlobalStorage, TempStorage } from 'service/storage';

const PIN_KEY = 'pin';
const WALLET_CONFIG_KEY = 'walletConfig';
export const USE_BIOMETRIC_KEY = 'useBiometric';

export interface AfterVerifiedConfig {
  fromRecovery: boolean;
  accountIdentifier: string;
  verifiedGuardians: Array<VerifiedGuardianDoc>;
  chainId: string;
  extraData: DeviceInfoType;
}

export const wrapExtraData = (extraData?: DeviceInfoType): string => {
  return JSON.stringify({
    deviceInfo: JSON.stringify(extraData ?? defaultExtraData),
    transactionTime: Date.now(),
  });
};

export const defaultExtraData: DeviceInfoType = {
  deviceName: 'Other',
  deviceType: DeviceType.OTHER,
};

export interface ContextInfo {
  clientId: string; // Actually it's the address of the KeyPair
  requestId: string; // private final String requestId = UUID.randomUUID().toString().replaceAll("-", ""); || or randomId()
}

export interface VerifiedGuardianDoc {
  type: AccountOriginalType;
  identifier: string;
  verifierId: string;
  verificationDoc: string;
  signature: string;
}

export enum AccountOriginalType {
  Email = 0,
  Phone = 1,
  Google = 2,
  Apple = 3,
}

export const getVerifiedAndLockWallet = async (
  deliveredAfterVerifiedConfig: string,
  pinValue: string,
  setBiometrics?: boolean,
): Promise<boolean> => {
  try {
    const afterVerifiedConfig: AfterVerifiedConfig = JSON.parse(deliveredAfterVerifiedConfig);
    if (!afterVerifiedConfig) {
      throw new Error('afterVerifiedConfig is null');
    }
    const { sessionId, pubKey, privKey, address } = await requestSocialRecoveryOrRegister(afterVerifiedConfig);
    if (!sessionId || !pubKey) {
      throw new Error('request failed');
    }
    const caInfo = await handleRequestPolling(
      async () => {
        return afterVerifiedConfig.fromRecovery
          ? NetworkController.checkSocialRecoveryProcess(sessionId, { maxWaitingTime: 3000 })
          : NetworkController.checkRegisterProcess(sessionId, { maxWaitingTime: 3000 });
      },
      10,
      500,
      result => {
        return (
          result?.totalCount > 0 &&
          (isRecoveryStatusItem(result)
            ? result.items[0]?.recoveryStatus === ProgressStatus.PASS
            : result.items[0]?.registerStatus) === ProgressStatus.PASS
        );
      },
    );
    const walletConfig: RecoverWalletConfig = {
      sessionId,
      fromRecovery: afterVerifiedConfig.fromRecovery,
      ...caInfo.items[0],
      pubKey,
      privKey,
      address,
    };
    await lockWallet(pinValue, walletConfig);
    rememberUseBiometric(setBiometrics ?? false);
    await sleep(500);
    return true;
  } catch (e) {
    console.error(e);
    CommonToast.fail('Network failed, please try again later');
  }
  return false;
};

const lockWallet = async (pinValue: string, config: RecoverWalletConfig): Promise<void> => {
  // TODO encrypt walletConfig
  GlobalStorage.set(PIN_KEY, pinValue);
  GlobalStorage.set(WALLET_CONFIG_KEY, JSON.stringify(config));

  // then set temp wallet
  TempStorage.set(WALLET_CONFIG_KEY, JSON.stringify(config));
};

export const rememberUseBiometric = async (useBiometric: boolean): Promise<void> => {
  GlobalStorage.set(USE_BIOMETRIC_KEY, useBiometric);
};

export const getUseBiometric = async (): Promise<boolean> => {
  return (await GlobalStorage.getBoolean(USE_BIOMETRIC_KEY)) ?? false;
};

export const isWalletUnlocked = async (): Promise<boolean> => {
  const tempWalletConfig = await TempStorage.getString(WALLET_CONFIG_KEY);
  return !!tempWalletConfig;
};

export const isWalletExists = async (): Promise<boolean> => {
  const storagePin = await GlobalStorage.getString(PIN_KEY);
  const walletConfig = await GlobalStorage.getString(WALLET_CONFIG_KEY);
  return !!storagePin && !!walletConfig;
};

export const checkPin = async (pinValue: string): Promise<boolean> => {
  const storagePin = await GlobalStorage.getString(PIN_KEY);
  return storagePin === pinValue;
};

export const unLockTempWallet = async (pinValue?: string, useBiometric = false): Promise<boolean> => {
  const storagePin = await GlobalStorage.getString(PIN_KEY);
  const walletConfig = await GlobalStorage.getString(WALLET_CONFIG_KEY);
  if ((storagePin !== pinValue && !useBiometric) || !walletConfig) {
    return false;
  }
  if (await isWalletUnlocked()) {
    return true;
  } else {
    // TODO decrypt walletConfig
    TempStorage.set(WALLET_CONFIG_KEY, walletConfig);
    return true;
  }
};

export type RecoverWalletConfig = {
  sessionId: string;
  fromRecovery: boolean;
} & CaInfo &
  WalletInfo;
