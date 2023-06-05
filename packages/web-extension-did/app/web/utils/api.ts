import {
  IntervalErrorMessage,
  SendVerificationConfig,
  Verification,
} from '@portkey-wallet/api/api-did/verification/utils';
import { localStorage } from 'redux-persist-webextension-storage';
import { IStorage } from '@portkey-wallet/types/storage';
import { request } from '@portkey-wallet/api/api-did';
import { checkReCaptcha } from './lib/checkReCaptcha';
import { RecaptchaType } from '@portkey-wallet/types/verifier';

export class ExtensionVerification extends Verification {
  constructor(store: IStorage) {
    super(store);
  }
  public async sendVerificationCode(config: SendVerificationConfig) {
    const { guardianIdentifier, verifierId, operationType } = config.params;
    const key = (guardianIdentifier || '') + (verifierId || '');

    try {
      const item = this.get(key);
      if (item) {
        return item;
      } else {
        const isNeedRecaptcha = operationType === RecaptchaType.register;
        const reCaptcha = await checkReCaptcha(operationType, isNeedRecaptcha);
        if (reCaptcha) {
          config.headers = {
            reCaptchaToken: reCaptcha,
          };
        }
        const req = await request.verify.sendVerificationRequest(config);
        await this.set(key, { ...req, time: Date.now() });
        return req;
      }
    } catch (error: any) {
      const { message } = error?.error || error || {};
      const item = this.get(key);
      if (message === IntervalErrorMessage && item) return item;
      throw error;
    }
  }
}

export const verification = new ExtensionVerification(localStorage);
