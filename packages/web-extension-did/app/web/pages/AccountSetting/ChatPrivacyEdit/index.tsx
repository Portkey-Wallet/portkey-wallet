import { useCommonState } from 'store/Provider/hooks';
import ChatPrivacyEditPrompt from './Prompt';
import ChatPrivacyEditPopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ContactPermissionEnum, IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';
import { useCallback, useState } from 'react';
import CustomModal from 'pages/components/CustomModal';

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

  const title = t('Chat privacy and security');
  const goBack = () => {
    navigate('/setting/account-setting/chat-privacy');
  };
  const [permissionSelected, setPermissionSelected] = useState(ContactPermissionEnum.EVERY_BODY);

  const changePermission = useCallback((id: ContactPermissionEnum) => {
    CustomModal({
      type: 'confirm',
      content: 'confirm change',
      onOk: () => {
        // TODO updatePermission(id);
        setPermissionSelected(id);
      },
      okText: 'Confirm',
    });
  }, []);

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
