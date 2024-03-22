import { ChainId } from '@portkey-wallet/types';
import { DeviceInfoType, DeviceType } from '@portkey-wallet/types/types-ca/device';
import { sleep } from '@portkey-wallet/utils';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import { PortkeyConfig } from 'global/constants';
import { requestSocialRecoveryOrRegister } from 'model/global';
import { NetworkController, handleRequestPolling } from 'network/controller';
import {
  ProgressStatus,
  RecoveryProgressDTO,
  RegisterProgressDTO,
  ManagerInfo,
  isRecoveryStatusItem,
  BaseAccountStatus,
} from 'network/dto/wallet';
import { GlobalStorage, TempStorage } from 'service/storage';
import { decrypt, decryptLocal, encrypt, encryptLocal } from 'utils/crypto';

const WALLET_CONFIG_KEY = 'walletConfig';
const USE_BIOMETRIC_KEY = 'useBiometric';
const LOCAL_WALLET_CONFIG_KEY = 'localWalletConfig';

export interface AfterVerifiedConfig {
  normalVerifyPathInfo?: NormalVerifyPathInfo;
  scanQRCodePathInfo?: ScanQRCodePathInfo;
}

export interface NormalVerifyPathInfo {
  fromRecovery: boolean;
  accountIdentifier: string;
  verifiedGuardians: Array<VerifiedGuardianDoc>;
  chainId: string;
  extraData?: DeviceInfoType;
}

export interface ScanQRCodePathInfo {
  walletInfo: ManagerInfo;
  originalChainId: string;
  accountIdentifier?: string;
  caHash: string;
  caAddress: string;
}

export const wrapExtraData = (extraData: DeviceInfoType = DefaultExtraData): string => {
  return JSON.stringify({
    deviceInfo: JSON.stringify(extraData),
    transactionTime: Date.now(),
  });
};

const DefaultExtraData: DeviceInfoType = {
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
    const { normalVerifyPathInfo, scanQRCodePathInfo } = afterVerifiedConfig || {};
    console.log('afterVerifiedConfig', afterVerifiedConfig);
    let walletConfig: RecoverWalletConfig | null = null;
    if (normalVerifyPathInfo) {
      walletConfig = await handleNormalVerify(normalVerifyPathInfo);
    } else if (scanQRCodePathInfo) {
      walletConfig = await handleScanQRCodeVerify(scanQRCodePathInfo);
    }
    if (!walletConfig) throw new Error('create wallet failed.');
    await createWallet(pinValue, walletConfig);
    rememberUseBiometric(setBiometrics ?? false, walletConfig);
    await sleep(500);
    return true;
  } catch (e) {
    console.error(e);
    CommonToast.fail('Network failed, please try again later');
  }
  return false;
};

const handleNormalVerify = async (config: NormalVerifyPathInfo): Promise<RecoverWalletConfig> => {
  const retryTimes = 100;
  const originalChainId = await PortkeyConfig.currChainId();
  const { fromRecovery, accountIdentifier } = config || {};
  const { sessionId, publicKey, privateKey, address } = await requestSocialRecoveryOrRegister(config);
  if (!sessionId || !publicKey) {
    throw new Error('request failed');
  }
  const status = await handleRequestPolling<RecoveryProgressDTO | RegisterProgressDTO>({
    sendRequest: () => {
      return fromRecovery
        ? NetworkController.checkSocialRecoveryProcess(sessionId, { maxWaitingTime: 3000 })
        : NetworkController.checkRegisterProcess(sessionId, { maxWaitingTime: 3000 });
    },
    maxPollingTimes: retryTimes,
    timeGap: 500,
    verifyResult: result => {
      const { items } = result || {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const item = items?.find((it: BaseAccountStatus) => it.chainId === originalChainId);
      if (item) {
        return isRecoveryStatusItem(item)
          ? item.recoveryStatus === ProgressStatus.PASS
          : item.registerStatus === ProgressStatus.PASS;
      } else {
        return false;
      }
    },
    declareFatalFail: alternative => {
      const { items } = alternative || {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const item = items?.find(it => it.chainId === originalChainId);
      if (item) {
        return isRecoveryStatusItem(item)
          ? item.recoveryStatus === ProgressStatus.FAIL
          : item.registerStatus === ProgressStatus.FAIL;
      } else {
        return false;
      }
    },
  });
  if (findVerifyProcessOnCurrChain(originalChainId, status) !== ProgressStatus.PASS) {
    console.warn(`after ${retryTimes} times polling, account status is still pending.`);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { caHash, caAddress } = status?.items?.find(it => it.chainId === originalChainId) || {};
  return {
    sessionId,
    fromRecovery,
    accountIdentifier,
    publicKey,
    privateKey,
    address,
    originalChainId,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    caInfo: { caHash, caAddress },
  };
};

const handleScanQRCodeVerify = async (config: ScanQRCodePathInfo): Promise<RecoverWalletConfig> => {
  const { walletInfo, accountIdentifier, caHash, caAddress, originalChainId } = config || {};
  return {
    ...walletInfo,
    accountIdentifier,
    originalChainId,
    caInfo: {
      caHash,
      caAddress,
    },
  };
};

const findVerifyProcessOnCurrChain = (
  chainId: ChainId,
  status: RecoveryProgressDTO | RegisterProgressDTO,
): ProgressStatus | undefined => {
  const { items } = status || {};
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const item = items?.find(it => it.chainId === chainId);
  if (item) {
    return isRecoveryStatusItem(item) ? item.recoveryStatus : item.registerStatus;
  }
  return undefined;
};

const createWallet = async (pinValue: string, config: RecoverWalletConfig): Promise<void> => {
  const walletInfo = JSON.stringify(config);
  const encryptedWalletConfig = encrypt(walletInfo, pinValue);
  GlobalStorage.set(WALLET_CONFIG_KEY, encryptedWalletConfig);

  // then set the temp wallet
  TempStorage.set(WALLET_CONFIG_KEY, walletInfo);
};

export const rememberUseBiometric = async (useBiometric: boolean, config: RecoverWalletConfig): Promise<void> => {
  const walletInfo = JSON.stringify(config);
  GlobalStorage.set(USE_BIOMETRIC_KEY, useBiometric);
  GlobalStorage.set(LOCAL_WALLET_CONFIG_KEY, await encryptLocal(walletInfo));
};

export const getUseBiometric = async (): Promise<boolean> => {
  return (await GlobalStorage.getBoolean(USE_BIOMETRIC_KEY)) ?? false;
};

export const isWalletUnlocked = async (): Promise<boolean> => {
  const tempWalletConfig = await TempStorage.getString(WALLET_CONFIG_KEY);
  return !!tempWalletConfig;
};

export const lockWallet = async (): Promise<void> => {
  TempStorage.remove(WALLET_CONFIG_KEY);
};

export const exitWallet = async (): Promise<void> => {
  GlobalStorage.remove(USE_BIOMETRIC_KEY);
  GlobalStorage.remove(WALLET_CONFIG_KEY);
  GlobalStorage.remove(LOCAL_WALLET_CONFIG_KEY);
  TempStorage.remove(WALLET_CONFIG_KEY);
};

export const getTempWalletConfig = async (): Promise<RecoverWalletConfig> => {
  const tempWalletConfig = await TempStorage.getString(WALLET_CONFIG_KEY);
  if (!tempWalletConfig) throw new Error('wallet not unlocked');
  return JSON.parse(tempWalletConfig);
};

export const isWalletExists = async (): Promise<boolean> => {
  const walletConfig = await GlobalStorage.getString(WALLET_CONFIG_KEY);
  return !!walletConfig;
};

export const checkPin = async (pinValue: string): Promise<boolean> => {
  try {
    const encrypted = await GlobalStorage.getString(WALLET_CONFIG_KEY);
    if (!encrypted || !pinValue) throw new Error('wallet not exist');
    const decrypted = decrypt(encrypted, pinValue);
    const decryptedWalletConfig = JSON.parse(decrypted);
    return !!decryptedWalletConfig;
  } catch (e) {
    console.log('checkPin error', e);
    return false;
  }
};
export const changePin = async (pinValue: string): Promise<void> => {
  const unlockedWallet = await TempStorage.getString(WALLET_CONFIG_KEY);
  if (!unlockedWallet) throw new Error('wallet not unlocked!');
  const encrypted = encrypt(unlockedWallet, pinValue);
  GlobalStorage.set(WALLET_CONFIG_KEY, encrypted);
};

export const unLockTempWallet = async (pinValue?: string, useBiometric = false): Promise<boolean> => {
  try {
    if (await isWalletUnlocked()) {
      return true;
    }
    let decrypted: string | undefined;
    if (useBiometric) {
      const encrypted = await GlobalStorage.getString(LOCAL_WALLET_CONFIG_KEY);
      console.log('encrypted', encrypted);
      if (!encrypted) throw new Error('wallet not exist');
      decrypted = await decryptLocal(encrypted);
    } else {
      const encrypted = await GlobalStorage.getString(WALLET_CONFIG_KEY);
      if (!encrypted || !pinValue) throw new Error('wallet not exist');
      decrypted = decrypt(encrypted, pinValue);
    }
    const decryptedWalletConfig = JSON.parse(decrypted);
    if (!decryptedWalletConfig) throw new Error('decrypt error!');
    TempStorage.set(WALLET_CONFIG_KEY, decrypted);
    return true;
  } catch (e) {
    console.log('unlock wallet failed', e);
    return false;
  }
};

export type RecoverWalletConfig = {
  sessionId?: string;
  fromRecovery?: boolean;
  accountIdentifier?: string;
  originalChainId?: string;
  caInfo?: {
    caHash: string;
    caAddress: string;
  };
} & ManagerInfo;
