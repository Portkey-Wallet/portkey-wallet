import { NetworkType } from '@portkey-wallet/types';
import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';
import { sleep } from '@portkey-wallet/utils';
import { message } from 'antd';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useCallback } from 'react';
import { CloseParams } from 'service/NotificationService';
import { CreatePromptType, ReCaptchaResponseParams, SendResponseParams } from 'types';
import { getPortkeyFinanceUrl } from 'utils';
import { setLocalStorage } from 'utils/storage/chromeStorage';
import { getWalletState } from './SWGetReduxStore';

export const completeRegistration = async () => {
  await setLocalStorage({ registerStatus: 'Registered' });
  await InternalMessage.payload(PortkeyMessageTypes.CLOSE_PROMPT, { isClose: false }).send();
};

export const closePrompt = async (closeParams?: CloseParams, promptType?: CreatePromptType) => {
  // await DappMiddle.middle
  await sleep(100);
  return InternalMessage.payload(PortkeyMessageTypes.CLOSE_PROMPT, {
    promptType,
    closeParams,
    isClose: true,
  }).send();
};

export const useLockWallet = () => {
  return useCallback(async () => {
    try {
      await InternalMessage.payload(PortkeyMessageTypes.LOCK_WALLET).send();
    } catch (error) {
      message.error('Lock error');
    }
  }, []);
};

export const useActiveLockStatusAction = () => {
  return useCallback(async () => {
    try {
      await InternalMessage.payload(PortkeyMessageTypes.ACTIVE_LOCK_STATUS).send();
    } catch (error) {
      message.error('Active lock error');
    }
  }, []);
};

export const setPinAction = async (pin: string) => {
  await InternalMessage.payload(PortkeyMessageTypes.SET_SEED, pin).send();
};

export const socialLoginAction = async (type: ISocialLogin, network: NetworkType): Promise<SendResponseParams> => {
  const { JOIN_AUTH_URL } = getPortkeyFinanceUrl(network);
  return await InternalMessage.payload(PortkeyMessageTypes.SOCIAL_LOGIN, {
    externalLink: `${JOIN_AUTH_URL}/${network}/${type}`,
  }).send();
};

export const reCAPTCHAAction = async (): Promise<ReCaptchaResponseParams> => {
  const wallet = await getWalletState();
  const { RECAPTCHA_URL } = getPortkeyFinanceUrl(wallet.currentNetwork);
  return await InternalMessage.payload(PortkeyMessageTypes.OPEN_RECAPTCHA_PAGE, {
    externalLink: `${RECAPTCHA_URL}`,
  }).send();
};
