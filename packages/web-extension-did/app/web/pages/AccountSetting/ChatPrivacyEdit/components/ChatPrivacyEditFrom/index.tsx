import './index.less';
import CustomSvg from 'components/CustomSvg';
import { GuardianTypeIcon } from 'components/VerifierPair';
import { ContactPermissionEnum, IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';
import {
  CONTACT_PERMISSION_LIST,
  CONTACT_PRIVACY_TYPE_LABEL_MAP,
} from '@portkey-wallet/constants/constants-ca/contact';
import MenuItem from 'components/MenuItem';
import clsx from 'clsx';

interface IChatPrivacyEditFromProps {
  state: IContactPrivacy;
  permissionSelected: ContactPermissionEnum;
  changePermission: (id: ContactPermissionEnum) => void;
}

export default function ChatPrivacyEditFrom({
  state,
  permissionSelected,
  changePermission,
}: IChatPrivacyEditFromProps) {
  return (
    <div className="chat-privacy-edit-form">
      <div className="info-privacy-label">{`My login ${CONTACT_PRIVACY_TYPE_LABEL_MAP[state.privacyType]}`}</div>
      <div className="info-privacy">
        <CustomSvg type={GuardianTypeIcon[state.privacyType]} className="info-privacy-icon" />
        <span className="info-identifier">{state.identifier}</span>
      </div>

      <div className="info-privacy-label">{`Who can see my ${CONTACT_PRIVACY_TYPE_LABEL_MAP[state.privacyType]}`}</div>
      {CONTACT_PERMISSION_LIST.map((item, index) => {
        return (
          <MenuItem
            key={'chat-privacy-edit-permission' + index}
            className={clsx([
              'chat-privacy-permission-item',
              permissionSelected === item.value ? 'chat-privacy-permission-item-selected' : null,
            ])}
            height={56}
            showEnterIcon={false}
            icon={permissionSelected === item.value ? <CustomSvg type="selected" /> : <div className="icon-empty" />}
            onClick={() => changePermission(item.value)}>
            {item.label}
          </MenuItem>
        );
      })}
    </div>
  );
}
