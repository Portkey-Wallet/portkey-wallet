import CustomSvg from 'components/CustomSvg';
import './index.less';
export interface ICalculatorProps {
  onTimeEnd?: () => void;
  showRateText: string;
  updateTime: number;
}
export default function Calculator(props: ICalculatorProps) {
  const { showRateText, updateTime } = props || {};

  return (
    <div className="deposit-cal-container">
      <div className="deposit-cal-wrapper">
        <span className="transfer-rate">{showRateText}</span>
        <div className="count-down-timer-container">
          <CustomSvg type="Timer" />
          <span className="s">{updateTime}s</span>
        </div>
      </div>
      <span className="slippage">Slippage: 5%</span>
    </div>
  );
}
