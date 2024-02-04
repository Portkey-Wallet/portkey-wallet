import { useState } from 'react';
import InputLogin from '../InputLogin';
import SocialLogin from '../SocialLogin';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { SocialLoginFinishHandler, ValidateHandler } from 'types/wallet';
import { LoginKey } from '@portkey-wallet/types/types-ca/wallet';
import { useNavigateState } from 'hooks/router';

enum STEP {
  socialLogin,
  inputLogin,
}
export default function SignCard({
  onFinish,
  validateEmail,
  validatePhone,
  onSocialSignFinish,
}: {
  onFinish: (data: LoginInfo) => void;
  validateEmail?: ValidateHandler;
  validatePhone?: ValidateHandler;
  onSocialSignFinish: SocialLoginFinishHandler;
}) {
  const [step, setStep] = useState<STEP>(STEP.socialLogin);

  const navigate = useNavigateState();

  const [defaultKey, setDefaultKey] = useState<LoginKey>();

  return (
    <div className="register-start-card sign-card">
      {step === STEP.inputLogin ? (
        <InputLogin
          type="Sign up"
          defaultKey={defaultKey}
          validateEmail={validateEmail}
          validatePhone={validatePhone}
          onFinish={onFinish}
          onBack={() => setStep(STEP.socialLogin)}
        />
      ) : (
        <SocialLogin
          type="Sign up"
          onFinish={onSocialSignFinish}
          switchLogin={(type) => {
            setStep(STEP.inputLogin);
            setDefaultKey(type);
          }}
          onBack={() => navigate('/register/start')}
        />
      )}
    </div>
  );
}
