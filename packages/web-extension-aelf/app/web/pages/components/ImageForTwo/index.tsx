import clsx from 'clsx';
import TokenImageDisplay from '../TokenImageDisplay';
import './index.less';

export interface IImageDetail {
  url?: string;
  symbol: string;
}

export interface IImageForTwoProps {
  iconTop: IImageDetail;
  iconBottom: IImageDetail;
  className?: string;
  wrapWidth?: number;
  iconWidth?: number;
}
export default function ImageForTwo({
  iconTop,
  iconBottom,
  className,
  wrapWidth = 32,
  iconWidth = 24,
}: IImageForTwoProps) {
  return (
    <div style={{ width: wrapWidth, height: wrapWidth }} className={clsx('show-two-image-wrap', className)}>
      <TokenImageDisplay width={iconWidth} className="two-image-top" src={iconTop.url} symbol={iconTop.symbol} />
      <TokenImageDisplay
        width={iconWidth}
        className="two-image-bottom"
        src={iconBottom.url}
        symbol={iconBottom.symbol}
      />
    </div>
  );
}
