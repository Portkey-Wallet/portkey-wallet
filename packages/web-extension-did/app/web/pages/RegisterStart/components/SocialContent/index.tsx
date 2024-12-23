import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { RegisterType } from 'types/wallet';
import { LoginGuardianListType } from '../SocialLogin';
import './index.less';

interface GoogleBtnProps {
  showLoginModeListToRecommend: LoginGuardianListType[];
  type: RegisterType;
}

export default function SocialContent({ type, showLoginModeListToRecommend }: GoogleBtnProps) {
  console.log('type', type);
  return (
    <div className="social-content-wrapper flex-column-between">
      {showLoginModeListToRecommend.map((i) => (
        <Button key={`recommend_${i.value}`} onClick={i.onClick}>
          <CustomSvg type={i.icon} />
          <span>{`Continue with ${i.type}`}</span>
          <span className="empty"></span>
        </Button>
      ))}
    </div>
  );
}
