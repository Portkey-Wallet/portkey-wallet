import { DeviceInfoType, DeviceType } from '@portkey-wallet/types/types-ca/device';
import CommonToast from 'components/CommonToast';
import { requestSocialRecoveryOrRegister } from 'model/global';
import { GlobalStorage, TempStorage } from 'service/storage';

const PIN_KEY = 'pin';
const WALLET_CONFIG_KEY = 'walletConfig';
const USE_BIOMETRIC_KEY = 'useBiometric';

export interface AfterVerifiedConfig {
  fromRecovery: boolean;
  accountIdentifier: string;
  verifiedGuardians: Array<VerifiedGuardianDoc>;
  manager: string; // Manager is the address of the accountIdentifier
  chainId: string;
  context: ContextInfo;
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
  requestId: string; // private final String requestId = UUID.randomUUID().toString().replaceAll("-", "");
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
    const { sessionId } = await requestSocialRecoveryOrRegister(afterVerifiedConfig);
    if (!sessionId) {
      throw new Error('sessionId is null');
    }
    // TODO await /api/app/search/accountregisterindex and /api/app/search/accountrecoverindex
    const walletConfig: RecoverWalletConfig = {
      sessionId,
    };
    await lockWallet(pinValue, walletConfig);
    rememberUseBiometric(setBiometrics ?? false);
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
};

export const rememberUseBiometric = async (useBiometric: boolean): Promise<void> => {
  GlobalStorage.set(USE_BIOMETRIC_KEY, useBiometric);
};

export const getUseBiometric = (): boolean => {
  return GlobalStorage.getBoolean(USE_BIOMETRIC_KEY) ?? false;
};

export const isTempWalletExist = (): boolean => {
  const tempWalletConfig = TempStorage.getString(WALLET_CONFIG_KEY);
  return !!tempWalletConfig;
};

export const unLockTempWallet = (pinValue: string): boolean => {
  const storagePin = GlobalStorage.getString(PIN_KEY);
  const walletConfig = GlobalStorage.getString(WALLET_CONFIG_KEY);
  if (storagePin !== pinValue || !walletConfig) {
    return false;
  }
  if (isTempWalletExist()) {
    return true;
  } else {
    // TODO decrypt walletConfig
    TempStorage.set(WALLET_CONFIG_KEY, walletConfig);
    return true;
  }
};

export interface RecoverWalletConfig {
  sessionId: string;

  // TODO caInfo here from /api/app/search/accountrecoverindex or /api/app/search/accountregisterindex
}
