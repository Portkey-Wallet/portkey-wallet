import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useNavigateState } from 'hooks/router';
import './index.less';

export default function ScreenOpeningPage() {
  const navigate = useNavigateState();
  const version = process.env.SDK_VERSION?.replace('v', '');
  // return <ScreenOpening className="fix-max-content" onFinish={() => navigate('/register/start')} />;
  return (
    <div className="fix-max-content open-page-wrapper">
      <div className="open-page-content">
        <CustomSvg type="LogoWhite" />
        <h1>Welcome to Portkey</h1>
        <p className="description">Your key to play and earn in Web 3</p>
        <Button onClick={() => navigate('/register/start')}>Get Start</Button>
      </div>
      <div className="version">{`v ${version}`}</div>
    </div>
  );
}
