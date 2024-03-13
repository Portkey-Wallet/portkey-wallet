import { NetworkController } from 'network/controller';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckVerifyCodeParams, CheckVerifyCodeResultDTO, SendVerifyCodeParams } from '../../../network/dto/guardian';
import { AccountOriginalType } from '../core';
import { VerifiedGuardianDoc } from '../core/index';

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
      timer.current && clearInterval(timer.current as unknown as number);
    };
  }, []);

  const startToCountDown = (seconds: number = INIT_TIME_OUT) => {
    setCountDown(seconds);
    timer.current = setInterval(() => {
      setCountDown(prev => {
        if (prev === 0) {
          timer.current && clearInterval(timer.current as unknown as number);
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
      const { sendVerifyCodeParams, chainId } = config;
      //  else if (!verifierSessionId && !config.verifySessionId) {
      //   console.error('You must send verify code first.');
      //   return null;
      // }
      try {
        // in some cases like edit payment limit, we need to change the target chain id
        let preparedParams: CheckVerifyCodeParams = {
          ...sendVerifyCodeParams,
          verificationCode,
          verifierSessionId,
        };
        if (chainId) {
          preparedParams = Object.assign({}, preparedParams, { chainId });
        }
        const result = await NetworkController.checkVerifyCode(preparedParams);
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
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
  isLoginGuardian: boolean;
  name: string;
  imageUrl: string;
  sendVerifyCodeParams: SendVerifyCodeParams;
  salt?: string;
  alreadySent?: boolean;
  verifySessionId?: string;
  thirdPartyEmail?: string;
  verifiedDoc?: CheckVerifyCodeResultDTO;
  identifierHash?: string;
  chainId?: string;
}

export enum GuardianStatus {
  INIT,
  SENT,
  VERIFIED,
}

export default usePhoneOrEmailGuardian;
