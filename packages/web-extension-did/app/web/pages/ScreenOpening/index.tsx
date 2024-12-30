import CustomSvg from 'components/CustomSvg';
import { useNavigateState } from 'hooks/router';
import RegisterHeader from 'pages/components/RegisterHeader';
import { CommonButton } from '@portkey/did-ui-react';
import './index.less';

export default function ScreenOpeningPage() {
  const navigate = useNavigateState();
  return (
    <div className="open-page-wrapper">
      <RegisterHeader />
      <div className="open-page-content">
        <CustomSvg type="WelcomeLogo" className="welcome-logo" />
        <div className="get-start-content">
          <CustomSvg type="PortKeyPrompt" className="welcome-portkey-prompt" />
          <h1>Your Gateway to the World of Web3</h1>
          <CommonButton type="primaryOutline" block onClick={() => navigate('/register/start')}>
            Get Start
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
