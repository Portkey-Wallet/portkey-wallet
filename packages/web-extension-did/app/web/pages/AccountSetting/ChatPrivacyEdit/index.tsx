import { useCommonState } from 'store/Provider/hooks';
import ChatPrivacyEditPrompt from './Prompt';
import ChatPrivacyEditPopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { MenuItemInfo } from 'pages/components/MenuList';
import { useMemo } from 'react';

export interface IChatPrivacyEditProps extends BaseHeaderProps {
  state?: any;
}

export default function ChatPrivacyEdit() {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const title = t('Chat privacy and security');
  const goBack = () => {
    navigate('/setting/account-setting/chat-privacy');
  };

  const menuList: MenuItemInfo[] = useMemo(
    () => [
      {
        key: 'phone number',
        element: 'phone number',
        click: () => {
          navigate('/setting/account-setting/chat-privacy-edit');
        },
      },
      {
        key: 'Email',
        element: 'Email',
        click: () => {
          navigate('/setting/account-setting/chat-privacy-edit');
        },
      },
    ],
    [navigate],
  );

  return isNotLessThan768 ? (
    <ChatPrivacyEditPrompt headerTitle={title} goBack={goBack} state={menuList[0]} />
  ) : (
    <ChatPrivacyEditPopup headerTitle={title} goBack={goBack} state={menuList[1]} />
  );
}
