import CustomSvg from 'components/CustomSvg';

interface IExchangeRateProps {
  showRateText: string;
  rateUpdateTime: number;
}

export default function ExchangeRate({ showRateText, rateUpdateTime }: IExchangeRateProps) {
  return (
    <div className="exchange-rate flex-between-center">
      <div>{showRateText}</div>
      <div className="timer flex-center">
        <CustomSvg type="Timer" />
        <div className="timestamp">{rateUpdateTime}s</div>
      </div>
    </div>
  );
}
