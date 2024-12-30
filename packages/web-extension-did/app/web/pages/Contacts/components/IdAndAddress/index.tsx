import './index.less';
import ContactAddressList from 'pages/Contacts/components/ContactAddressList';
import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import clsx from 'clsx';
// import Copy from 'components/Copy';

interface IIdAndAddressProps {
  addresses: AddressItem[];
  addressSectionLabel?: string;
}

export default function IdAndAddress({ addresses, addressSectionLabel = 'Address' }: IIdAndAddressProps) {
  return (
    <div className="id-and-address">
      {addresses?.length > 0 && (
        <div className="info-section">
          <div className={clsx(['info-title', 'title-did'])}>{addressSectionLabel}</div>
          <ContactAddressList list={addresses} />
        </div>
      )}
    </div>
  );
}
