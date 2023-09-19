import { useCommonState } from 'store/Provider/hooks';
import ChatPrivacyPrompt from './Prompt';
import ChatPrivacyPopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { MenuItemInfo } from 'pages/components/MenuList';
import { useMemo } from 'react';

export interface IChatPrivacyProps extends BaseHeaderProps {
  menuList: MenuItemInfo[];
}

export default function ChatPrivacy() {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const title = t('Chat privacy and security');
  const goBack = () => {
    navigate('/setting/account-setting');
  };

  const menuList: MenuItemInfo[] = useMemo(
    () => [
      {
        key: 'phone number',
        element: 'phone number',
        click: () => {
          navigate('/setting/account-setting/chat-privacy-edit', { state: {} }); // TODO state
        },
      },
      {
        key: 'Email',
        element: 'Email',
        click: () => {
          navigate('/setting/account-setting/chat-privacy-edit', { state: {} }); // TODO state
        },
      },
    ],
    [navigate],
  );

  return isNotLessThan768 ? (
    <ChatPrivacyPrompt headerTitle={title} goBack={goBack} menuList={menuList} />
  ) : (
    <ChatPrivacyPopup headerTitle={title} goBack={goBack} menuList={menuList} />
  );
}
