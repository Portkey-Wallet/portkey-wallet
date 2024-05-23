import CustomSvg from 'components/CustomSvg';
import QRCodeCommon from 'pages/components/QRCodeCommon';
import { Avatar } from '@portkey-wallet/im-ui-web';
import { ChannelTypeEnum } from '@portkey-wallet/im';
import './index.less';

export interface IShowQRCodeProps {
  onBack?: () => void;
  showName?: string;
  type?: ChannelTypeEnum;
  desc?: string;
  icon?: string;
  qrCodeValue?: string;
  showHeader?: boolean;
}

export default function ShowQRCode({
  onBack,
  showName = '',
  type,
  desc = '',
  icon,
  qrCodeValue,
  showHeader = true,
}: IShowQRCodeProps) {
  return (
    <div className="show-qrcode-wrapper flex-column">
      {showHeader && (
        <div className="show-qrcode-header">
          <CustomSvg onClick={onBack} type="SuggestClose" />
        </div>
      )}
      <div className="show-qrcode-content flex-column-center">
        <div className="qrcode-content-icon"></div>
        <Avatar
          avatarSize="large"
          src={icon}
          isGroupAvatar={type === ChannelTypeEnum.GROUP}
          letter={showName.slice(0, 1)?.toUpperCase()}
        />
        <div className="qrcode-content-name">{showName}</div>
        <div className="qrcode-content-qrcode"></div>
        <QRCodeCommon value={`${qrCodeValue}`} />
        <div className="qrcode-content-desc">{desc}</div>
      </div>
    </div>
  );
}
