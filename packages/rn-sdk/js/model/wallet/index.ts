import { getCaInfoByAccountIdentifierOrSessionId } from 'model/global';
import { getTempWalletConfig } from 'model/verify/after-verify';
import { NetworkController } from 'network/controller';
import { WalletInfo } from 'network/dto/wallet';

export const getUnlockedWallet = async (): Promise<UnlockedWallet> => {
  const {
    sessionId,
    accountIdentifier,
    fromRecovery,
    originalChainId = 'AELF',
    privateKey,
    publicKey,
    address,
  } = (await getTempWalletConfig()) || {};
  const caInfo = await getCaInfoByAccountIdentifierOrSessionId(
    originalChainId,
    accountIdentifier,
    fromRecovery,
    sessionId,
  );
  const chainInfo = (await NetworkController.getNetworkInfo())?.items?.find(it => it.chainId === originalChainId);
  if (!chainInfo) throw new Error('network failure');
  const currChainNetworkConfig = {
    peerUrl: chainInfo.endPoint,
    caContractAddress: chainInfo.caContractAddress,
  };
  return {
    caInfo,
    currChainNetworkConfig,
    originChainId: originalChainId,
    privateKey,
    publicKey,
    address,
  };
};

export type UnlockedWallet = {
  caInfo: {
    caHash: string;
    caAddress: string;
  };
  currChainNetworkConfig: {
    peerUrl: string;
    caContractAddress: string;
  };
  originChainId: string;
} & WalletInfo;
