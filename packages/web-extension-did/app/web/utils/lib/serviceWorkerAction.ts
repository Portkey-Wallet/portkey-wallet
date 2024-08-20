import { NetworkType } from '@portkey-wallet/types';
import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';
import { sleep } from '@portkey-wallet/utils';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { CloseParams } from 'service/NotificationService';
import { CreatePromptType, ReCaptchaResponseParams, SendResponseParams } from 'types';
import { getPortkeyFinanceUrl } from 'utils';
import { getWalletState } from './SWGetReduxStore';
import { apis } from 'utils/BrowserApis';
import singleMessage from 'utils/singleMessage';
import { VerifyTypeEnum } from 'types/wallet';
import { zkloginGuardianType } from 'constants/guardians';
import { generateNonceAndTimestamp } from '@portkey-wallet/utils/nonce';
import AElf from 'aelf-sdk';

export const timeout = async (timer = 2000) => {
  await sleep(timer);
  return 'Chrome service worker is not working';
};

export const closeTabPrompt = async (closeParams: CloseParams) => {
  if (!closeParams?.windowId) {
    const tab = await apis.tabs.getCurrent();
    closeParams.windowId = tab?.id;
  }
  return closePrompt(closeParams, 'tabs');
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

export const lockWallet = async () => {
  try {
    await InternalMessage.payload(PortkeyMessageTypes.LOCK_WALLET).send();
  } catch (error) {
    singleMessage.error('Lock error');
  }
};

export const activeLockStatusAction = async () => {
  const res = await Promise.race([InternalMessage.payload(PortkeyMessageTypes.ACTIVE_LOCK_STATUS).send(), timeout()]);
  console.log(res, 'Check ACTIVE_LOCK_STATUS');
  if (typeof res === 'string') return chrome.runtime.reload();
};

export const setPinAction = (pin: string) => InternalMessage.payload(PortkeyMessageTypes.SET_SEED, pin).send();

const twitterAuthPath = '/api/app/twitterAuth/receive';
const facebookAuthPath = '/api/app/facebookAuth/receive';

export const socialLoginAction = async (
  type: ISocialLogin,
  network: NetworkType,
  verifyType?: VerifyTypeEnum,
  verifyExtraParams?: { managerAddress: string },
): Promise<SendResponseParams> => {
  const { JOIN_AUTH_URL, JOIN_TELEGRAM_URL, OPEN_LOGIN_URL, domain } = getPortkeyFinanceUrl(network);
  let externalLink = `${JOIN_AUTH_URL}/${network}/${type}?version=v2`;

  let zkNonce = '';
  let zkTimestamp = 0;
  if (verifyType === VerifyTypeEnum.zklogin) {
    if (!verifyExtraParams?.managerAddress) {
      throw 'managerAddress is required';
    }
    if (zkloginGuardianType.includes(type)) {
      const { nonce, timestamp } = generateNonceAndTimestamp(verifyExtraParams?.managerAddress);
      // nonce = AElf.utils.sha256(Date.now().toString()); // todo_wade: generate nonce
      if (type === 'Apple') {
        zkNonce = AElf.utils.sha256(nonce);
      } else {
        zkNonce = nonce;
      }
      zkTimestamp = timestamp;
      externalLink = `${OPEN_LOGIN_URL}/social-login/${type}?nonce=${zkNonce}&socialType=${verifyType}&side=portkey`;
    }
  }
  if (type === 'Telegram') {
    externalLink = JOIN_TELEGRAM_URL;
  } else if (type === 'Facebook' || type === 'Twitter') {
    externalLink = `${OPEN_LOGIN_URL}/social-login/${type}?redirectURI=${domain}${
      type === 'Facebook' ? facebookAuthPath : twitterAuthPath
    }`;
  }
  const result = await InternalMessage.payload(PortkeyMessageTypes.SOCIAL_LOGIN, {
    externalLink,
  }).send();
  if (result.error) throw result.message || 'auth error';
  result.data = Object.assign(result.data || {}, { nonce: zkNonce, timestamp: zkTimestamp });
  return result;
};

export const reCAPTCHAAction = async (): Promise<ReCaptchaResponseParams> => {
  const wallet = await getWalletState();
  const { RECAPTCHA_URL } = getPortkeyFinanceUrl(wallet.currentNetwork);
  return await InternalMessage.payload(PortkeyMessageTypes.OPEN_RECAPTCHA_PAGE, {
    externalLink: `${RECAPTCHA_URL}?version=v2`,
  }).send();
};
