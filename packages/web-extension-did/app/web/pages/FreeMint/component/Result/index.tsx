import { Button } from 'antd';
import CircleLoading from 'components/CircleLoading';
import CustomSvg from 'components/CustomSvg';
import ImageDisplay from 'pages/components/ImageDisplay';
import { useMemo } from 'react';
import { FreeMintStatus } from '@portkey-wallet/types/types-ca/freeMint';
import './index.less';

export interface IFreeMintResult {
  previewFile: string;
  status: FreeMintStatus;
  onClickClose(): void;
  onSetAvatar(): void;
  onClickViewInWallet(): void;
  onClickTryAgain(): void;
}

export default function Result({
  previewFile,
  status,
  onClickClose,
  onSetAvatar,
  onClickViewInWallet,
  onClickTryAgain,
}: IFreeMintResult) {
  const renderStatusIcon = useMemo(() => {
    if (status === FreeMintStatus.PENDING) {
      return (
        <div className="free-mint-status-loading flex-center">
          <CircleLoading />
        </div>
      );
    }
    if (status === FreeMintStatus.SUCCESS) {
      return <CustomSvg className="free-mint-status-icon" type="FreeMintSuccess" />;
    }
    if (status === FreeMintStatus.FAIL) {
      return <CustomSvg className="free-mint-status-icon" type="FreeMintFailed" />;
    }
    return null;
  }, [status]);
  const mintStatusText = useMemo(() => {
    if (status === FreeMintStatus.PENDING) {
      return 'Minting...';
    }
    if (status === FreeMintStatus.SUCCESS) {
      return 'Minted';
    }
    if (status === FreeMintStatus.FAIL) {
      return 'Mint Failed';
    }
    return '';
  }, [status]);
  const mintStatusTip = useMemo(() => {
    if (status === FreeMintStatus.PENDING) {
      return 'Your NFT is being minted.';
    }
    if (status === FreeMintStatus.SUCCESS) {
      return 'Your NFT has been successfully minted.';
    }
    if (status === FreeMintStatus.FAIL) {
      return (
        <>
          Mint failure could be due to network issues.
          <br /> Please try again.
        </>
      );
    }
    return '';
  }, [status]);
  return (
    <div className="free-mint-status flex-column-between flex-1">
      <div className="status-container flex-1 flex-column-center">
        <div className="status-container-image">
          <ImageDisplay defaultHeight={200} src={previewFile} />
          {renderStatusIcon}
        </div>
        <div className="status-container-text">{mintStatusText}</div>
        <div className="status-container-tip">{mintStatusTip}</div>
      </div>
      <div className="btn-container flex-column-center gap-8">
        {status === FreeMintStatus.PENDING && (
          <>
            <div className="btn-minting-tip">You can safely close this window and view it later in NFTs.</div>
            <Button onClick={onClickClose}>Close</Button>
          </>
        )}
        {status === FreeMintStatus.SUCCESS && (
          <>
            <Button type="primary" onClick={onSetAvatar}>
              Set as Profile Photo
            </Button>
            <Button className="warning" onClick={onClickViewInWallet}>
              View in Wallet
            </Button>
          </>
        )}
        {status === FreeMintStatus.FAIL && (
          <Button type="primary" onClick={onClickTryAgain}>
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
