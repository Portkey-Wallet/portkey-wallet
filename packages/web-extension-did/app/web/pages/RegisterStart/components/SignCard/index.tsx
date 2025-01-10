import { useState } from 'react';
import InputLogin from '../InputLogin';
import SocialLogin from '../SocialLogin';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { SocialLoginFinishHandler, ValidateHandler } from 'types/wallet';
import { ISocialLogin, LoginKey } from '@portkey-wallet/types/types-ca/wallet';
import { useNavigateState } from 'hooks/router';

enum STEP {
  socialLogin,
  inputLogin,
}
export default function SignCard({
  loading,
  onFinish,
  validateEmail,
  validatePhone,
  onSocialStart,
  onSocialSignFinish,
}: {
  loading: boolean;
  onFinish: (data: LoginInfo) => void;
  onSocialStart: (type: ISocialLogin) => void;
  validateEmail?: ValidateHandler;
  validatePhone?: ValidateHandler;
  onSocialSignFinish: SocialLoginFinishHandler;
}) {
  const [step, setStep] = useState<STEP>(STEP.inputLogin);

  const navigate = useNavigateState();

  const [defaultKey, setDefaultKey] = useState<LoginKey>();

  return (
    <div className="register-start-card sign-card">
      {step === STEP.inputLogin ? (
        <InputLogin
          type="Sign up"
          loading={loading}
          defaultKey={defaultKey}
          validateEmail={validateEmail}
          validatePhone={validatePhone}
          onFinish={onFinish}
          onBack={() => navigate('/register/start')}
        />
      ) : (
        <SocialLogin
          type="Sign up"
          loading={loading}
          onFinish={onSocialSignFinish}
          onSocialStart={onSocialStart}
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
