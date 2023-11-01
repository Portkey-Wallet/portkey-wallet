import { ChainId } from '@portkey-wallet/types';
import { DeviceInfoType, DeviceType } from '@portkey-wallet/types/types-ca/device';
import { sleep } from '@portkey-wallet/utils';
import CommonToast from 'components/CommonToast';
import { PortkeyConfig } from 'global/constants';
import { requestSocialRecoveryOrRegister } from 'model/global';
import { NetworkController, handleRequestPolling } from 'network/controller';
import {
  ProgressStatus,
  RecoveryProgressDTO,
  RegisterProgressDTO,
  WalletInfo,
  isRecoveryStatusItem,
} from 'network/dto/wallet';
import { GlobalStorage, TempStorage } from 'service/storage';

const PIN_KEY = 'pin';
const WALLET_CONFIG_KEY = 'walletConfig';
const USE_BIOMETRIC_KEY = 'useBiometric';

export interface AfterVerifiedConfig {
  normalVerifyPathInfo?: NormalVerifyPathInfo;
  scanQRCodePathInfo?: ScanQRCodePathInfo;
}

export interface NormalVerifyPathInfo {
  fromRecovery: boolean;
  accountIdentifier: string;
  verifiedGuardians: Array<VerifiedGuardianDoc>;
  chainId: string;
  extraData: DeviceInfoType;
}

export interface ScanQRCodePathInfo {
  walletInfo: WalletInfo;
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
    console.log('normalVerifyPathInfo', normalVerifyPathInfo);
    let walletConfig: RecoverWalletConfig | null = null;
    if (normalVerifyPathInfo) {
      walletConfig = await handleNormalVerify(normalVerifyPathInfo);
    } else if (scanQRCodePathInfo) {
      walletConfig = await handleScanQRCodeVerify(scanQRCodePathInfo);
    }
    if (!walletConfig) throw new Error('create wallet failed.');
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

const handleNormalVerify = async (config: NormalVerifyPathInfo): Promise<RecoverWalletConfig> => {
  const retryTimes = 10;
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
      const item = items?.find(it => it.chainId === originalChainId);
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
  return {
    sessionId,
    fromRecovery,
    accountIdentifier,
    publicKey,
    privateKey,
    address,
    originalChainId,
    caInfo: status?.items?.find(it => it.chainId === originalChainId) ?? undefined,
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
  const item = items?.find(it => it.chainId === chainId);
  if (item) {
    return isRecoveryStatusItem(item) ? item.recoveryStatus : item.registerStatus;
  }
  return undefined;
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

export const getTempWalletConfig = async (): Promise<RecoverWalletConfig> => {
  const tempWalletConfig = await TempStorage.getString(WALLET_CONFIG_KEY);
  if (!tempWalletConfig) throw new Error('wallet not unlocked');
  return JSON.parse(tempWalletConfig);
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
  sessionId?: string;
  fromRecovery?: boolean;
  accountIdentifier?: string;
  originalChainId?: string;
  caInfo?: {
    caHash: string;
    caAddress: string;
  };
} & WalletInfo;
