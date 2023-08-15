import './index.less';
import ContactAddressList from 'pages/Contacts/components/ContactAddressList';
import CustomSvg from 'components/CustomSvg';
import { AddressItem } from '@portkey-wallet/types/types-ca/contact';

interface IIdAndAddressProps {
  portkeyId: string;
  relationOneId: string;
  addresses: AddressItem[];
  handleCopy: (val: string) => void;
}

export default function IdAndAddress({ portkeyId, relationOneId, addresses, handleCopy }: IIdAndAddressProps) {
  return (
    <div className="id-and-address">
      {/* Section - ID */}
      {portkeyId && (
        <div className="info-section section-border-bottom">
          <div className="info-title">Portkey ID</div>
          <div className="flex-row-between info-content">
            <div className="info-desc">{portkeyId}</div>
            <CustomSvg onClick={() => handleCopy(portkeyId)} type="Copy" className="id-copy-icon" />
          </div>
        </div>
      )}

      {!portkeyId && relationOneId && (
        <div className="info-section section-border-bottom">
          <div className="info-title">{`ID (relation one)`}</div>
          <div className="flex-row-between info-content">
            <div className="info-desc">{relationOneId}</div>
            <CustomSvg onClick={() => handleCopy(relationOneId)} type="Copy" className="id-copy-icon" />
          </div>
        </div>
      )}

      {/* Section - Address */}
      <div className="info-section">
        <div className="info-title">{`DID`}</div>
        <ContactAddressList list={addresses} />
      </div>
    </div>
  );
}
