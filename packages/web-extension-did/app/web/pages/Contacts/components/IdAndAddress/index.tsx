import './index.less';
import ContactAddressList from 'pages/Contacts/components/ContactAddressList';
import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import clsx from 'clsx';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
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

  return (
    <div className="id-and-address">
      {/* Section - ID - my - wallet */}

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
