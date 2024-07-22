import { DEFAULT_TOKEN } from '@portkey-wallet/constants/constants-ca/wallet';
import { useAmountInUsdShow } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { Button } from 'antd';
import ImageDisplay from 'pages/components/ImageDisplay';
import { chianInfoShow } from 'pages/CryptoGifts/utils';
import { ICollectionData } from '@portkey-wallet/types/types-ca/freeMint';
import './index.less';

export interface IFreeMintPreview {
  previewFile: string;
  nftName: string;
  desc: string;
  mintInfo: ICollectionData | undefined;
  onClickCancel(): void;
  onClickMint(): void;
}

export default function Preview({
  previewFile,
  nftName,
  desc,
  mintInfo,
  onClickCancel,
  onClickMint,
}: IFreeMintPreview) {
  const amountInUsdShow = useAmountInUsdShow();
  return (
    <div className="free-mint-preview flex-column-between flex-1">
      <div className="preview-container flex-1 flex-column gap-16">
        <div className="mint-detail flex">
          <ImageDisplay className="mint-detail-image" defaultHeight={64} src={previewFile} />
          <div className="flex-column">
            <div className="mint-detail-name">{nftName}</div>
            <div className="mint-detail-desc">{desc}</div>
          </div>
        </div>
        <div className="other-detail flex-column">
          <div className="flex-between-center">
            <div className="label">Chain</div>
            <div className="value">{chianInfoShow(mintInfo?.collectionInfo.chainId ?? 'AELF')}</div>
          </div>
          <div className="flex-between-center">
            <div className="label">Collection</div>
            <div className="value flex-row-center">
              <ImageDisplay
                className="other-detail-image"
                defaultHeight={20}
                src={mintInfo?.collectionInfo?.imageUrl ?? ''}
              />
              <span>{mintInfo?.collectionInfo.collectionName}</span>
            </div>
          </div>
          <div className="flex-between-center">
            <div className="label">Transaction Fee</div>
            <div className="value">
              <div>{`${mintInfo?.transactionFee} ${DEFAULT_TOKEN.symbol}`}</div>
              <div className="fee-usd">{amountInUsdShow(mintInfo?.transactionFee || 0, 0, DEFAULT_TOKEN.symbol)}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="btn-container flex-row-center gap-16">
        <Button className="warning" onClick={onClickCancel}>
          Cancel
        </Button>
        <Button type="primary" onClick={onClickMint}>
          Mint
        </Button>
      </div>
    </div>
  );
}
