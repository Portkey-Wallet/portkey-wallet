import { NetworkController } from 'network/controller';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckVerifyCodeResultDTO, SendVerifyCodeParams } from '../../../network/dto/guardian';
import { AccountOriginalType } from '../after-verify';
import { VerifiedGuardianDoc } from '../after-verify/index';

const usePhoneOrEmailGuardian = (config: GuardianConfig) => {
  const [status, setStatus] = useState(GuardianStatus.INIT);
  const [verifierSessionId, setVerifierSessionId] = useState<string>('');
  const [verifiedDoc, setVerifiedDoc] = useState<CheckVerifyCodeResultDTO | null>(null);
  const configCached = useRef<GuardianConfig | null>();
  const sendVerifyCode = useCallback(
    async (googleRecaptchaToken?: string): Promise<boolean> => {
      if (status === GuardianStatus.VERIFIED) {
        console.warn('Guardian already verified.');
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
    [status, config],
  );

  const checkVerifyCode = useCallback(
    async (verificationCode: string): Promise<boolean> => {
      if (status !== GuardianStatus.SENT) {
        console.warn('You can not check verify code at this stage.');
        return true;
      } else if (!verifierSessionId) {
        console.error('You must send verify code first.');
        return false;
      }
      try {
        const result = await NetworkController.checkVerifyCode({
          ...config.sendVerifyCodeParams,
          verificationCode,
          verifierSessionId,
        });
        if (result.verificationDoc && result.signature) {
          setStatus(GuardianStatus.VERIFIED);
          setVerifiedDoc(result);
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.warn(e);
        return false;
      }
    },
    [status, config, verifierSessionId],
  );

  const getVerifiedGuardianDoc = useCallback(() => {
    return {
      type: config.accountOriginalType,
      identifier: config.accountIdentifier,
      verifierId: config.sendVerifyCodeParams.verifierId,
      verificationDoc: verifiedDoc?.verificationDoc ?? '',
      signature: verifiedDoc?.signature ?? '',
    } as VerifiedGuardianDoc;
  }, [verifiedDoc, config]);

  useEffect(() => {
    if (config !== configCached.current) {
      configCached.current = config;
      setStatus(GuardianStatus.INIT);
    }
  }, [config]);

  return {
    status,
    sendVerifyCode,
    checkVerifyCode,
    getVerifiedGuardianDoc,
  };
};
export interface GuardianConfig {
  readonly accountIdentifier: string;
  readonly accountOriginalType: AccountOriginalType;
  readonly isLoginGuardian: boolean;
  readonly name: string;
  readonly imageUrl: string;
  readonly sendVerifyCodeParams: SendVerifyCodeParams;
}

export enum GuardianStatus {
  INIT,
  SENT,
  VERIFIED,
}

export default usePhoneOrEmailGuardian;
