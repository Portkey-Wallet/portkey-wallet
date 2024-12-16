import clsx from 'clsx';
import { Button } from 'antd';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import NFTImageDisplay from '../NFTImageDisplay';
import { SeedTypeEnum } from '@portkey-wallet/types/types-ca/assets';
import { NFTSizeEnum } from 'utils/assets';
import './index.less';

export interface INFTBalanceShowProps {
  alias: string;
  tokenId: string;
  symbol: string;
  imageUrl?: string;
  balance: string;
  decimals: string;
  isSeed?: boolean;
  seedType?: SeedTypeEnum;
  seedTypeTagSize?: NFTSizeEnum;
  onClickMax: () => void;
  className?: string;
}

export default function NFTBalanceShow(props: INFTBalanceShowProps) {
  const { alias, tokenId, imageUrl, balance, decimals, onClickMax, className, isSeed, seedType, seedTypeTagSize } =
    props;
  return (
    <div className={clsx('nft-balance-show flex', className)}>
      <NFTImageDisplay
        src={imageUrl}
        alias={alias}
        width={42}
        isSeed={isSeed}
        seedType={seedType}
        seedTypeTagSize={seedTypeTagSize}
      />
      <div className="flex-1">
        <div>{`${alias} #${tokenId}`}</div>
        <div className="balance-text">{`${formatTokenAmountShowWithDecimals(balance, decimals)} available`}</div>
      </div>
      {/* TODO-SA */}
      <Button className="max-button" onClick={onClickMax}>
        MAX
      </Button>
    </div>
  );
}
