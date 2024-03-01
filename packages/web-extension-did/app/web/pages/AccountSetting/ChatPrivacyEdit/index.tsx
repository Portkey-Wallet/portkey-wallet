import { useCommonState, useLoading } from 'store/Provider/hooks';
import ChatPrivacyEditPrompt from './Prompt';
import ChatPrivacyEditPopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ContactPermissionEnum, IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';
import { useCallback, useState } from 'react';
import CustomModal from 'pages/components/CustomModal';
import { useContactPrivacyList } from '@portkey-wallet/hooks/hooks-ca/security';
import { handleErrorMessage, sleep } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';
import { CONTACT_PERMISSION_LABEL_MAP } from '@portkey-wallet/constants/constants-ca/contact';
import { useLocationState } from 'hooks/router';

export interface IChatPrivacyEditProps extends BaseHeaderProps {
  state: IContactPrivacy;
  permissionSelected: ContactPermissionEnum;
  changePermission: (id: ContactPermissionEnum) => void;
}

export default function ChatPrivacyEdit() {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const { state } = useLocationState<IContactPrivacy>();
  const navigate = useNavigate();
  const { update } = useContactPrivacyList();
  const { setLoading } = useLoading();

  const title = t('Privacy');
  const goBack = () => {
    navigate('/setting/account-setting/chat-privacy');
  };
  const [permissionSelected, setPermissionSelected] = useState(state.permission);

  const changePermission = useCallback(
    (id: ContactPermissionEnum) => {
      if (id === permissionSelected) return;

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
            setLoading(true);
            await update({ ...state, permission: id });
            await sleep(1000);
            setPermissionSelected(id);
            setLoading(false);
          } catch (error) {
            setLoading(false);
            const msg = handleErrorMessage(error);
            singleMessage.error(msg);
          }
        },
        okText: 'Confirm',
      });
    },
    [permissionSelected, setLoading, state, update],
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
