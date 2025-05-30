import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import AccountSettingPrompt from './Prompt';
import AccountSettingPopup from './Popup';
import { MenuItemInfo } from 'pages/components/MenuList';
import { BaseHeaderProps } from 'types/UI';
import { useCommonState } from 'store/Provider/hooks';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';

export interface IAccountSettingProps extends BaseHeaderProps {
  menuList: MenuItemInfo[];
}

export default function AccountSetting() {
  const { t } = useTranslation();
  const showChat = useIsChatShow();
  const navigate = useNavigate();

  const { isNotLessThan768 } = useCommonState();

  const MenuList: MenuItemInfo[] = useMemo(() => {
    const list = [
      {
        key: 'change-pin',
        element: 'Change Pin',
        click: () => {
          navigate('/setting/account-setting/confirm-pin');
        },
      },
    ];
    showChat &&
      list.push({
        key: t('chat-privacy'),
        element: 'Privacy',
        click: () => {
          navigate('/setting/account-setting/chat-privacy');
        },
      });

    return list;
  }, [navigate, showChat, t]);

  const headerTitle = t('Account Setting');

  return isNotLessThan768 ? (
    <AccountSettingPrompt headerTitle={headerTitle} menuList={MenuList} />
  ) : (
    <AccountSettingPopup headerTitle={headerTitle} menuList={MenuList} />
  );
}
