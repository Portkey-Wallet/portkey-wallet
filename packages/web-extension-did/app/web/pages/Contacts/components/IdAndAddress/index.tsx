import './index.less';
import ContactAddressList from 'pages/Contacts/components/ContactAddressList';
import CustomSvg from 'components/CustomSvg';
import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import clsx from 'clsx';

interface IIdAndAddressProps {
  portkeyId: string;
  relationId: string;
  addresses: AddressItem[];
  handleCopy: (val: string) => void;
}

export default function IdAndAddress({ portkeyId, relationId, addresses, handleCopy }: IIdAndAddressProps) {
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

      {!portkeyId && relationId && (
        <div className="info-section section-border-bottom">
          <div className="info-title">{`ID (relation one)`}</div>
          <div className="flex-row-between info-content">
            <div className="info-desc">{relationId}</div>
            <CustomSvg onClick={() => handleCopy(relationId)} type="Copy" className="id-copy-icon" />
          </div>
        </div>
      )}

      {/* Section - Address */}
      {addresses?.length > 0 && (
        <div className="info-section">
          <div className={clsx(['info-title', !portkeyId && !relationId ? '' : 'title-did'])}>{`DID`}</div>
          <ContactAddressList list={addresses} />
        </div>
      )}
    </div>
  );
}
