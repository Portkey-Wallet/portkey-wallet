import { useNavigate } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import './index.less';

interface IDepositPageProps {
  chainId: string;
  symbol: string;
}

export default function DepositPage({ chainId, symbol }: IDepositPageProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/token-detail/deposit-home/${chainId}/${symbol}`);
  };

  return (
    <div className="deposit-page flex-column-center">
      <div className="deposit-page-logo flex-column-center">
        <CustomSvg type="DepositLogo" />
        <div className="deposit-logo-tip">
          Enjoy effortless cross-chain functionality and deposit assets directly into your Portkey wallet.
        </div>
      </div>
      <div className="deposit-page-operation-entry flex-row-center cursor-pointer" onClick={handleNavigate}>
        <div className="direction-deposit-icon-wrap flex-center">
          <CustomSvg type="DirectionDeposit" />
        </div>
        <div className="operation-entry-text flex-1">Select deposit network</div>
        <CustomSvg type="DirectionRight" />
      </div>
    </div>
  );
}
