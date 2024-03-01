import './index.less';
import ContactAddressList from 'pages/Contacts/components/ContactAddressList';
import CustomSvg from 'components/CustomSvg';
import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import clsx from 'clsx';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useWalletInfo } from 'store/Provider/hooks';
import { useNavigate } from 'react-router';
import Copy from 'components/Copy';

interface IIdAndAddressProps {
  portkeyId?: string;
  relationId?: string;
  addresses: AddressItem[];
  addressSectionLabel?: string;
}

export default function IdAndAddress({
  portkeyId,
  relationId,
  addresses,
  addressSectionLabel = 'Address',
}: IIdAndAddressProps) {
  const showChat = useIsChatShow();
  const { userInfo } = useWalletInfo();
  const navigate = useNavigate();

  return (
    <div className="id-and-address">
      {/* Section - ID - my - wallet */}
      {portkeyId && portkeyId === userInfo?.userId && (
        <div className="info-section section-border-bottom">
          <div className="info-title">Portkey ID</div>
          <div className="flex-row-between info-content">
            <div className="info-desc-my-wallet">{portkeyId}</div>
            <div className="info-icon flex">
              <Copy toCopy={portkeyId} iconType="Copy4" />
              <CustomSvg type="QRCode2" onClick={() => navigate('/setting/wallet/qrcode')} />
            </div>
          </div>
        </div>
      )}

      {/* Section - ID - contact */}
      {showChat && portkeyId && portkeyId !== userInfo?.userId && (
        <div className="info-section section-border-bottom">
          <div className="info-title">Portkey ID</div>
          <div className="flex-row-between info-content">
            <div className="info-desc">{portkeyId}</div>
            <Copy toCopy={portkeyId} iconType="Copy4" iconClassName="id-copy-icon" />
          </div>
        </div>
      )}

      {showChat && !portkeyId && relationId && (
        <div className="info-section section-border-bottom">
          <div className="info-title">{`ID`}</div>
          <div className="flex-row-between info-content">
            <div className="info-desc">{relationId}</div>
            <Copy toCopy={relationId} iconClassName="id-copy-icon" iconType="Copy4" />
          </div>
        </div>
      )}

      {/* Section - Address */}
      {addresses?.length > 0 && (
        <div className="info-section">
          <div className={clsx(['info-title', !portkeyId && !relationId ? '' : 'title-did'])}>
            {addressSectionLabel}
          </div>
          <ContactAddressList list={addresses} />
        </div>
      )}
    </div>
  );
}
