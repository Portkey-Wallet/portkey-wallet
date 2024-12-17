import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useNavigateState } from 'hooks/router';
import './index.less';
import RegisterHeader from 'pages/components/RegisterHeader';

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
          {/* TODO: Button styles */}
          <Button onClick={() => navigate('/register/start')}>Get Start</Button>
        </div>
      </div>
    </div>
  );
}
