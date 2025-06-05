import CustomSvg from 'components/CustomSvg';
import { RegisterType } from 'types/wallet';
import { LoginGuardianListType } from '../SocialLogin';
import { CommonButton } from '@portkey/did-ui-react';
import './index.less';

interface GoogleBtnProps {
  showLoginModeListToRecommend: LoginGuardianListType[];
  type: RegisterType;
  loading: boolean;
  accountType?: string;
}

export default function SocialContent({ type, accountType, showLoginModeListToRecommend, loading }: GoogleBtnProps) {
  console.log('type', type);
  return (
    <div className="social-content-wrapper flex-column-between">
      {showLoginModeListToRecommend.map((i) => (
        <CommonButton
          loading={accountType === i.type && loading}
          type="outline"
          key={`recommend_${i.value}`}
          onClick={i.onClick}>
          <CustomSvg type={i.icon} />
          <span>{`Continue with ${i.type}`}</span>
          <span className="empty"></span>
        </CommonButton>
      ))}
    </div>
  );
}
