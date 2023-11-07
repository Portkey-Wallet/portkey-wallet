import { NetworkController } from 'network/controller';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckVerifyCodeResultDTO, SendVerifyCodeParams } from '../../../network/dto/guardian';
import { AccountOriginalType } from '../after-verify';
import { VerifiedGuardianDoc } from '../after-verify/index';

export const INIT_TIME_OUT = 60;

const usePhoneOrEmailGuardian = (config: GuardianConfig): GuardianEntity => {
  const [status, setStatus] = useState(config.alreadySent ? GuardianStatus.SENT : GuardianStatus.INIT);
  const [countDown, setCountDown] = useState<number>(0);
  const [verifierSessionId, setVerifierSessionId] = useState<string>(config.verifySessionId ?? '');
  const [verifiedDoc, setVerifiedDoc] = useState<CheckVerifyCodeResultDTO | null>(null);
  const sendVerifyCode = useCallback(
    async (googleRecaptchaToken?: string): Promise<boolean> => {
      if (status === GuardianStatus.VERIFIED) {
        console.warn('Guardian already verified.');
        return false;
      } else if (countDown > 0) {
        console.warn('Please wait for the countdown to finish.');
        return false;
      }
      const needGoogleRecaptcha = await NetworkController.isGoogleRecaptchaOpen(
        config.sendVerifyCodeParams.operationType,
      );
      if (needGoogleRecaptcha && !googleRecaptchaToken) {
        console.warn('Need google recaptcha! Better check it before calling this function.');
        return false;
      }
      const result = await NetworkController.sendVerifyCode(
        config.sendVerifyCodeParams,
        googleRecaptchaToken ? { reCaptchaToken: googleRecaptchaToken } : {},
      );
      if (result.verifierSessionId) {
        setStatus(GuardianStatus.SENT);
        setVerifierSessionId(result.verifierSessionId);
        return true;
      } else {
        return false;
      }
    },
    [status, countDown, config.sendVerifyCodeParams],
  );

  const timer = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    startToCountDown();
    return () => {
      timer.current && clearInterval(timer.current);
    };
  }, []);

  const startToCountDown = (seconds: number = INIT_TIME_OUT) => {
    setCountDown(seconds);
    timer.current = setInterval(() => {
      setCountDown(prev => {
        if (prev === 0) {
          timer.current && clearInterval(timer.current);
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);
  };

  const checkVerifyCode = useCallback(
    async (verificationCode: string): Promise<CheckVerifyCodeResultDTO | null> => {
      if (status !== GuardianStatus.SENT) {
        console.warn('You can not check verify code at this stage.');
        return null;
      }
      //  else if (!verifierSessionId && !config.verifySessionId) {
      //   console.error('You must send verify code first.');
      //   return null;
      // }
      try {
        const result = await NetworkController.checkVerifyCode({
          ...config.sendVerifyCodeParams,
          verificationCode,
          verifierSessionId,
        });
        if (result.verificationDoc && result.signature) {
          setStatus(GuardianStatus.VERIFIED);
          setVerifiedDoc(result);
          return result;
        } else {
          return result;
        }
      } catch (e) {
        console.warn(e);
        return null;
      }
    },
    [status, config, verifierSessionId],
  );

  const getVerifiedGuardianDoc = useCallback(() => {
    return {
      type: config.accountOriginalType,
      identifier: config.sendVerifyCodeParams.guardianIdentifier,
      verifierId: config.sendVerifyCodeParams.verifierId,
      verificationDoc: verifiedDoc?.verificationDoc ?? '',
      signature: verifiedDoc?.signature ?? '',
    } as VerifiedGuardianDoc;
  }, [verifiedDoc, config]);

  return {
    status,
    countDown,
    sendVerifyCode,
    checkVerifyCode,
    getVerifiedGuardianDoc,
  };
};

export interface GuardianEntity {
  status: GuardianStatus;
  countDown: number;
  sendVerifyCode: (googleRecaptchaToken?: string) => Promise<boolean>;
  checkVerifyCode: (verificationCode: string) => Promise<CheckVerifyCodeResultDTO | null>;
  getVerifiedGuardianDoc: () => VerifiedGuardianDoc;
}

export interface GuardianConfig {
  readonly accountIdentifier: string;
  readonly accountOriginalType: AccountOriginalType;
  readonly isLoginGuardian: boolean;
  readonly name: string;
  readonly imageUrl: string;
  sendVerifyCodeParams: SendVerifyCodeParams;
  readonly salt?: string;
  readonly alreadySent?: boolean;
  readonly verifySessionId?: string;
  readonly thirdPartyEmail?: string;
  readonly verifiedDoc?: CheckVerifyCodeResultDTO;
}

export enum GuardianStatus {
  INIT,
  SENT,
  VERIFIED,
}

export default usePhoneOrEmailGuardian;
