import { useState } from 'react';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { ValidateHandler } from 'types/wallet';
import InputLogin from '../InputLogin';
import SocialLogin from '../SocialLogin';
import { LoginKey } from '@portkey-wallet/types/types-ca/wallet';

enum STEP {
  socialLogin,
  inputLogin,
}
export default function LoginCard({
  onFinish,
  validateEmail,
  validatePhone,
  onSocialLoginFinish,
}: {
  onFinish: (data: LoginInfo) => void;
  validateEmail?: ValidateHandler;
  validatePhone?: ValidateHandler;
  onSocialLoginFinish: (data: any) => void;
}) {
  const [step, setStep] = useState<STEP>(STEP.socialLogin);
  const [defaultKey, setDefaultKey] = useState<LoginKey>();

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
        />
      ) : (
        <SocialLogin
          type="Login"
          onFinish={onSocialLoginFinish}
          switchLogin={(type) => {
            setStep(STEP.inputLogin);
            setDefaultKey(type);
          }}
        />
      )}
    </div>
  );
}
