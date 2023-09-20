import CustomSvg from 'components/CustomSvg';
import QRCodeCommon from 'pages/components/QRCodeCommon';
import './index.less';

export interface IShowQRCodeProps {
  onBack: () => void;
  showName?: string;
  isGroup?: boolean;
  desc?: string;
  qrCodeValue?: string;
}

export default function ShowQRCode({
  onBack,
  showName = '',
  isGroup = false,
  desc = '',
  qrCodeValue,
}: IShowQRCodeProps) {
  return (
    <div className="show-qrcode-wrapper flex-column">
      <div className="show-qrcode-header">
        <CustomSvg onClick={onBack} type="Close2" />
      </div>
      <div className="show-qrcode-content flex-column-center">
        <div className="qrcode-content-icon"></div>
        {isGroup ? (
          <div className="group-icon common-icon flex-center">
            <CustomSvg type="GroupAvatar" />
          </div>
        ) : (
          <div className="common-icon flex-center">{showName.slice(0, 1)?.toUpperCase() || 'A'}</div>
        )}
        <div className="qrcode-content-name">{showName}</div>
        <div className="qrcode-content-qrcode"></div>
        <QRCodeCommon value={`${qrCodeValue}`} />
        <div className="qrcode-content-desc">{desc}</div>
      </div>
    </div>
  );
}
