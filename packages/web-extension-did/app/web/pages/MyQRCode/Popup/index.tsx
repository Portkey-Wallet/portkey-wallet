import ShowQRCode from 'pages/components/ShowQRCode';
import { IMyQRCodeProps } from '..';
import './index.less';

const MyQRCodePopup = ({ onBack, qrCodeValue, showName, desc }: IMyQRCodeProps) => {
  return (
    <div className="my-wallet-share-page">
      <ShowQRCode onBack={onBack} qrCodeValue={qrCodeValue} showName={showName} desc={desc} />
    </div>
  );
};
export default MyQRCodePopup;
