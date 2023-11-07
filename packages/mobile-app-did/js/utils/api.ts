import { request } from '@portkey-wallet/api/api-did';
import {
  IntervalErrorMessage,
  SendVerificationConfig,
  Verification,
} from '@portkey-wallet/api/api-did/verification/utils';
import { IStorage } from '@portkey-wallet/types/storage';
import { baseStore } from '@portkey-wallet/utils/mobile/storage';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';
import { getAppCheckToken } from './appCheck';

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
        const result = await request.verify.checkGoogleRecaptcha({
          params: {
            operationType,
          },
        });
        const isNeedRecaptcha = !!result;

        if (isNeedRecaptcha) {
          // app check
          try {
            const appCheckToken = await getAppCheckToken();
            config.headers = {
              appCheckToken: appCheckToken || '',
            };
            const request1 = await request.verify.sendVerificationRequest(config);
            await this.set(key, { ...request1, time: Date.now() });
            return request1;
          } catch (err: any) {
            // google  human-machine verification
            if (err?.code === 206) {
              // TODO: change response code
              // TODO: add language
              const reCaptchaToken = await verifyHumanMachine('en');
              config.headers = {
                reCaptchaToken: reCaptchaToken as string,
              };
              const request2 = await request.verify.sendVerificationRequest(config);
              await this.set(key, { ...request2, time: Date.now() });
              return request2;
            }
          }

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
