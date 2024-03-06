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
import { useMemo } from 'react';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import BaseGuardianTypeIcon from 'components/BaseGuardianTypeIcon';

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
  const whoCanSeeLabel = useMemo(() => {
    return state.privacyType === LoginType.Phone
      ? CONTACT_PRIVACY_TYPE_LABEL_MAP[state.privacyType].toLocaleLowerCase()
      : CONTACT_PRIVACY_TYPE_LABEL_MAP[state.privacyType];
  }, [state.privacyType]);

  return (
    <div className="chat-privacy-edit-form">
      <div className="info-privacy-label">{`My Login ${CONTACT_PRIVACY_TYPE_LABEL_MAP[state.privacyType]}`}</div>
      <div className="info-privacy">
        <BaseGuardianTypeIcon type={GuardianTypeIcon[state.privacyType]} className="info-privacy-icon" />
        <span className="info-identifier">{state.identifier}</span>
      </div>

      <div className="info-privacy-label">{`Who can see my ${whoCanSeeLabel}`}</div>
      {CONTACT_PERMISSION_LIST.map((item, index) => {
        return (
          <MenuItem
            key={'chat-privacy-edit-permission' + index}
            className={clsx([
              'chat-privacy-permission-item',
              permissionSelected === item.value && 'chat-privacy-permission-item-selected',
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
