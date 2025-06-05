import { forwardRef, useImperativeHandle, useState } from 'react';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { ValidateHandler } from 'types/wallet';
import InputLogin from '../InputLogin';
import SocialLogin from '../SocialLogin';
import { ISocialLogin, LoginKey } from '@portkey-wallet/types/types-ca/wallet';

enum STEP {
  socialLogin,
  inputLogin,
}
const LoginCard = forwardRef(
  (
    {
      onFinish,
      validateEmail,
      validatePhone,
      onSocialStart,
      onSocialLoginFinish,
      isStartInput,
      loading = false,
    }: {
      onFinish: (data: LoginInfo) => void;
      validateEmail?: ValidateHandler;
      validatePhone?: ValidateHandler;
      onSocialStart: (type: ISocialLogin) => void;
      onSocialLoginFinish: (data: any) => void;
      isStartInput?: boolean;
      loading: boolean;
    },
    ref,
  ) => {
    const [step, setStep] = useState<STEP>(isStartInput ? STEP.inputLogin : STEP.socialLogin);
    const [defaultKey, setDefaultKey] = useState<LoginKey>();
    useImperativeHandle(ref, () => ({
      setStep,
    }));
    return (
      <div className="register-start-card login-card">
        {step === STEP.inputLogin ? (
          <InputLogin
            type="Login"
            defaultKey={defaultKey}
            validateEmail={validateEmail}
            validatePhone={validatePhone}
            onFinish={onFinish}
            onBack={() => setStep(STEP.socialLogin)}
            loading={loading}
          />
        ) : (
          <SocialLogin
            type="Login"
            onSocialStart={onSocialStart}
            onFinish={onSocialLoginFinish}
            switchLogin={(type) => {
              setStep(STEP.inputLogin);
              setDefaultKey(type);
            }}
            loading={loading}
          />
        )}
      </div>
    );
  },
);
export default LoginCard;
