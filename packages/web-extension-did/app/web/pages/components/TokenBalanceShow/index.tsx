import clsx from 'clsx';
import TokenImageDisplay from '../TokenImageDisplay';
import { Button } from 'antd';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import './index.less';

export interface ITokenBalanceShowProps {
  label?: string;
  symbol: string;
  imageUrl?: string;
  balance: string;
  decimals: string | number;
  className?: string;
  onClickMax: () => void;
}

export default function TokenBalanceShow(props: ITokenBalanceShowProps) {
  const { label, symbol, imageUrl, balance, decimals, onClickMax, className } = props;
  const symbolImages = useSymbolImages();
  return (
    <div className={clsx('token-balance-show flex', className)}>
      <TokenImageDisplay src={imageUrl || symbolImages[label || symbol]} width={42} />
      <div className="flex-1">
        <div>{label || symbol}</div>
        <div className="balance-text">{`${formatTokenAmountShowWithDecimals(balance, decimals)} available`}</div>
      </div>
      {/* TODO-SA */}
      <Button className="max-button" onClick={onClickMax}>
        MAX
      </Button>
    </div>
  );
}
