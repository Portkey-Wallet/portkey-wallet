import ShowQRCode from 'pages/components/ShowQRCode';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IMyQRCodeProps } from '..';
import './index.less';

const MyQRCode = ({ onBack, qrCodeValue, showName, desc, icon }: IMyQRCodeProps) => {
  return (
    <div className="my-wallet-share-page-prompt">
      <SecondPageHeader
        className="my-wallet-share-prompt-header"
        paddingLeft={24}
        title="My QR Code"
        leftCallBack={onBack}
      />
      <ShowQRCode icon={icon} qrCodeValue={qrCodeValue} showName={showName} desc={desc} showHeader={false} />
    </div>
  );
};
export default MyQRCode;
