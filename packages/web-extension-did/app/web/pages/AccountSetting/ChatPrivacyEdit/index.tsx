import { useCommonState } from 'store/Provider/hooks';
import ChatPrivacyEditPrompt from './Prompt';
import ChatPrivacyEditPopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ContactPermissionEnum, IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';
import { useCallback, useState } from 'react';
import CustomModal from 'pages/components/CustomModal';
import { useContactPrivacyList } from '@portkey-wallet/hooks/hooks-ca/security';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { message } from 'antd';
import { CONTACT_PERMISSION_LABEL_MAP } from '@portkey-wallet/constants/constants-ca/contact';

export interface IChatPrivacyEditProps extends BaseHeaderProps {
  state: IContactPrivacy;
  permissionSelected: ContactPermissionEnum;
  changePermission: (id: ContactPermissionEnum) => void;
}

export default function ChatPrivacyEdit() {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { update } = useContactPrivacyList();

  const title = t('Privacy');
  const goBack = () => {
    navigate('/setting/account-setting/chat-privacy');
  };
  const [permissionSelected, setPermissionSelected] = useState(ContactPermissionEnum.EVERY_BODY);

  const changePermission = useCallback(
    (id: ContactPermissionEnum) => {
      CustomModal({
        type: 'confirm',
        content: (
          <div>
            <div className="modal-title">{`You are changing the visibility of this to "${CONTACT_PERMISSION_LABEL_MAP[id]}"`}</div>
            <div>{'After confirmation, your account info will be visible to the selected group.'}</div>
          </div>
        ),
        onOk: async () => {
          try {
            await update({ ...state, permission: id });
            setPermissionSelected(id);
          } catch (error) {
            const msg = handleErrorMessage(error);
            message.error(msg);
          }
        },
        okText: 'Confirm',
      });
    },
    [state, update],
  );

  return isNotLessThan768 ? (
    <ChatPrivacyEditPrompt
      headerTitle={title}
      goBack={goBack}
      state={state}
      permissionSelected={permissionSelected}
      changePermission={changePermission}
    />
  ) : (
    <ChatPrivacyEditPopup
      headerTitle={title}
      goBack={goBack}
      state={state}
      permissionSelected={permissionSelected}
      changePermission={changePermission}
    />
  );
}
