import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import SecurityPopup from './Popup';
import { MenuItemInfo } from 'pages/components/MenuList';
import { BaseHeaderProps } from 'types/UI';
import { CustomSvgV3 } from 'components/CustomSvgV3';

export interface ISecurityProps extends BaseHeaderProps {
  menuList: MenuItemInfo[];
  select?: string;
  onClose?: () => void;
}

const AutoLockLabel = 'auto-lock';

export default function Security() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isPrompt } = useCommonState();

  const MenuList: MenuItemInfo[] = useMemo(
    () => [
      {
        element: 'Auto-lock',
        key: AutoLockLabel,
        icon: <CustomSvgV3 type="my_auto_lock" />,
        click: () => {
          // setSelectedItem(AutoLockLabel);
          navigate('/setting/security/auto-lock');
        },
      },
      {
        key: 'change-pin',
        element: 'Change Pin',
        icon: <CustomSvgV3 type="my_pin" />,
        click: () => {
          navigate('/setting/security/confirm-pin');
        },
      },
    ],

    [navigate],
  );

  useEffect(() => {
    if (isPrompt && pathname === '/setting/wallet') {
      // setSelectedItem('');
    } else if (isPrompt && MenuList) {
      MenuList.forEach((item) => {
        if (pathname.includes(String(item.key))) {
          // setSelectedItem(String(item.key));
        }
      });
    }
  }, [MenuList, isPrompt, pathname]);

  const title = t('Security');
  const goBack = useCallback(() => navigate('/setting'), [navigate]);

  return <SecurityPopup headerTitle={title} menuList={MenuList} goBack={goBack} />;
}
