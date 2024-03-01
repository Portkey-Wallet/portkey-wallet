import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';
import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { RegisterType } from 'types/wallet';
import './index.less';

interface GoogleBtnProps {
  onSocialChange: (guardianType: ISocialLogin) => Promise<void>;
  type: RegisterType;
}

export default function SocialContent({ type, onSocialChange }: GoogleBtnProps) {
  return (
    <div className="social-content-wrapper">
      <Button onClick={() => onSocialChange('Google')}>
        <CustomSvg type="Google" />
        <span>{`${type} with Google`}</span>
        <span className="empty"></span>
      </Button>

      <Button onClick={() => onSocialChange('Apple')}>
        <CustomSvg type="Apple" />
        <span>{`${type} with Apple`}</span>
        <span className="empty"></span>
      </Button>
    </div>
  );
}
