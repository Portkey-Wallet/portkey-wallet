import PortKeyTitle from 'pages/components/PortKeyTitle';
import { PrepareWalletProgress } from './PrepareWalletProgress';
import CustomSvg from 'components/CustomSvg';
import './index.less';
// import { useAppDispatch } from 'store/Provider/hooks';
import { Button } from 'antd';
import { useNavigateState } from 'hooks/router';
import { useParams } from 'react-router';
export interface PrepareWalletProgressInterface {
  complete: () => void;
}
export const PrepareWallet = () => {
  // const dispatch = useAppDispatch();
  const navigate = useNavigateState();
  const { type: state } = useParams<{ type: 'login' | 'scan' | 'register' }>();
  return (
    <div className="prepare-wallet-page flex-column">
      <PortKeyTitle
        hideSubtitle
        leftElement
        renderContent={
          <>
            <CustomSvg type="WelcomeLogo" className="welcome-logo" />
            <PrepareWalletProgress />
            {/* TODO: auto login */}
            <Button onClick={() => navigate(`/success-page/${state}`)}>Next</Button>
          </>
        }
      />
    </div>
  );
};
