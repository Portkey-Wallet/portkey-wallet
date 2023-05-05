import { reCAPTCHAAction } from './serviceWorkerAction';
import { request } from '@portkey-wallet/api/api-did';

/**
 * check is need to call Google reCAPTCHA
 * @returns {string} check response
 */
export const checkReCaptcha = async () => {
  const req = await request.verify.checkGoogleRecaptcha();
  if (req) {
    // Google reCAPTCHA
    const reCaptcha = await reCAPTCHAAction();
    if (reCaptcha?.error) throw reCaptcha.message || reCaptcha.error;
    return reCaptcha.response || '';
  } else {
    return '';
  }
};
