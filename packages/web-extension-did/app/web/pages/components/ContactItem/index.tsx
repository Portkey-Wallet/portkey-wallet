import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import React, { memo } from 'react';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import ImageDisplay from '../ImageDisplay';
import ContactAddress from '../ContactAddress';
import './index.less';

export interface ItemType {
  contact: IContactItemType;
  onClick?: (item?: any) => void;
  isSaved?: boolean;
  showInfoIcon?: boolean;
  onInfoIconClick?: (item?: any) => void;
}

const ContactItem: React.FC<ItemType> = (props) => {
  const { contact, onClick, isSaved = true, showInfoIcon = false, onInfoIconClick } = props;

  return (
    <div className="contact-item-wrap flex" onClick={onClick}>
      <div className="contact-item-avatar">
        <ImageDisplay
          className="item-avatar"
          defaultWidth={40}
          defaultHeight={40}
          borderRadius={20}
          name={(contact?.name || contact?.caHolderInfo?.walletName)?.toUpperCase()}
          src={contact.caHolderInfo?.avatar || ''}
        />
        {contact.addressInfo.networkImage && (
          <ImageDisplay
            hasBorder
            defaultWidth={20}
            defaultHeight={20}
            borderRadius={10}
            className="item-avatar-corner"
            src={contact.addressInfo.networkImage}
          />
        )}
      </div>
      <div className="contact-item-info flex-1">
        {isSaved ? (
          <>
            <div className="row-top">{contact?.name || contact?.caHolderInfo?.walletName}</div>
            <ContactAddress className="row-bottom" contact={contact} />
          </>
        ) : (
          <>
            <ContactAddress className="row-top" contact={contact} ignoreFormat={!isSaved} />
            <div className="row-bottom">{contact?.addressInfo?.networkName}</div>
          </>
        )}
      </div>
      {showInfoIcon && <CustomSvgV3 className="contact-info-icon" type="info" onClick={onInfoIconClick} />}
    </div>
  );
};

export default memo(ContactItem);
