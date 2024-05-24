import CustomSvg from 'components/CustomSvg';
import './index.less';

export default function DepositPage() {
  return (
    <div className="deposit-page flex-column-center">
      <div className="deposit-page-logo flex-column-center">
        <CustomSvg type="DepositLogo" />
        <div className="deposit-logo-tip">
          Enjoy effortless cross-chain functionality and deposit assets directly into your Portkey wallet.
        </div>
      </div>
      <div className="deposit-page-operation-entry flex-row-center cursor-pointer" onClick={() => void 0}>
        <div className="direction-deposit-icon-wrap flex-center">
          <CustomSvg type="DirectionDeposit" />
        </div>
        <div className="operation-entry-text flex-1">Select deposit network</div>
        <CustomSvg type="DirectionRight" />
      </div>
    </div>
  );
}
