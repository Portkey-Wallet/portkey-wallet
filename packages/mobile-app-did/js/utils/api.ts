import { request } from '@portkey-wallet/api/api-did';
import {
  IntervalErrorMessage,
  SendVerificationConfig,
  Verification,
} from '@portkey-wallet/api/api-did/verification/utils';
import { IStorage } from '@portkey-wallet/types/storage';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { baseStore } from '@portkey-wallet/utils/mobile/storage';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';

class MobileVerification extends Verification {
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
        let isNeedRecaptcha = operationType === OperationTypeEnum.register;
        if (!isNeedRecaptcha) {
          const result = await request.verify.checkGoogleRecaptcha({
            params: {
              operationType,
            },
          });
          isNeedRecaptcha = !!result;
        }

        if (isNeedRecaptcha) {
          // TODO: add language
          const reCaptchaToken = await verifyHumanMachine('en');
          config.headers = {
            reCaptchaToken: reCaptchaToken as string,
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

export const verification = new MobileVerification(baseStore);
