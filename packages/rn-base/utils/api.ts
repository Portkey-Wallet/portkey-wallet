import { request } from '@portkey-wallet/rn-inject-sdk';
import {
  IntervalErrorMessage,
  SendVerificationConfig,
  Verification,
} from '@portkey-wallet/api/api-did/verification/utils';
import { IStorage } from '@portkey-wallet/types/storage';
import { baseStore } from '@portkey-wallet/utils/mobile/storage';
import { verifyHumanMachine } from '@portkey-wallet/rn-components/components/VerifyHumanMachine';
import { getAppCheckToken } from './appCheck';

const NoVerifierSessionIdMessage = 'no verifierSessionId';
const GetAppCheckTokenFailMessage = 'get appCheckToken fail';

class MobileVerification extends Verification {
  constructor(store: IStorage) {
    super(store);
  }
  public async sendVerificationCode(config: SendVerificationConfig) {
    const { guardianIdentifier, verifierId, operationType } = config.params;
    const key = (guardianIdentifier || '') + (verifierId || '');

    try {
      const item = this.get(key);
      console.log('item', item);
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
            const appCheckToken = await getAppCheckToken(true);
            if (!appCheckToken) throw Error(GetAppCheckTokenFailMessage);

            config.headers = {
              acToken: appCheckToken || '',
            };

            const responseByAppCheck = await request.verify.sendVerificationRequest(config);
            if (!responseByAppCheck?.verifierSessionId) throw Error(NoVerifierSessionIdMessage);

            await this.set(key, { ...responseByAppCheck, time: Date.now() });
            return responseByAppCheck;
          } catch (err) {
            console.log('appCheck  error', err);
          }

          // google  human-machine verification
          // TODO: add language
          const reCaptchaToken = await verifyHumanMachine('en');
          config.headers = {
            reCaptchaToken: reCaptchaToken as string,
          };

          const responseByCaptchaToken = await request.verify.sendVerificationRequest(config);
          await this.set(key, {
            ...responseByCaptchaToken,
            time: Date.now(),
          });
          return responseByCaptchaToken;
        }

        const req = await request.verify.sendVerificationRequest(config);
        if (!req?.verifierSessionId) throw Error(NoVerifierSessionIdMessage);
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
