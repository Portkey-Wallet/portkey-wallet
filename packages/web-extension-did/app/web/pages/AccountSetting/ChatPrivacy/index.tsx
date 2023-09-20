import { useCommonState } from 'store/Provider/hooks';
import ChatPrivacyPrompt from './Prompt';
import ChatPrivacyPopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { MenuItemInfo } from 'pages/components/MenuList';
import { useMemo } from 'react';
import { ContactPermissionEnum, IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import CustomSvg from 'components/CustomSvg';
import {
  CONTACT_PERMISSION_LABEL_MAP,
  CONTACT_PRIVACY_TYPE_LABEL_MAP,
} from '@portkey-wallet/constants/constants-ca/contact';
import './index.less';
import { GuardianTypeIcon } from 'components/VerifierPair';

export interface IChatPrivacyProps extends BaseHeaderProps {
  menuList: MenuItemInfo[];
  menuItemHeight: number;
}

const mock: IContactPrivacy[] = [
  {
    id: '',
    identifier: '34teyrutiyu@portkey.finance',
    privacyType: LoginType.Apple,
    permission: ContactPermissionEnum.EVERY_BODY,
  },
  {
    id: '2',
    identifier: '34teyrutiyu@portkey.finance',
    privacyType: LoginType.Email,
    permission: ContactPermissionEnum.NOBODY,
  },
  {
    identifier: '34teyrutiyu@portkey.finance',
    privacyType: LoginType.Google,
    permission: ContactPermissionEnum.EVERY_BODY,
  },
  {
    id: '',
    identifier: '34teyrutiyu@portkey.finance',
    privacyType: LoginType.Phone,
    permission: ContactPermissionEnum.MY_CONTACTS,
  },
];

export default function ChatPrivacy() {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const title = t('Chat privacy and security');
  const goBack = () => {
    navigate('/setting/account-setting');
  };
  const menuItemHeight = 92;

  const menuList: MenuItemInfo[] = useMemo(() => {
    return mock.map((item) => {
      return {
        key: item.identifier + item.privacyType,
        icon: <CustomSvg type={GuardianTypeIcon[item.privacyType]} className="info-privacy-icon" />,
        element: (
          <div className="flex-between-center info-privacy">
            <div className="info-left">
              <div className="info-left-title">{CONTACT_PRIVACY_TYPE_LABEL_MAP[item.privacyType]}</div>
              <div className="info-left-identifier">{item.identifier}</div>
            </div>
            <div className="info-right">{CONTACT_PERMISSION_LABEL_MAP[item.permission]}</div>
          </div>
        ),
        click: () => {
          navigate('/setting/account-setting/chat-privacy-edit', { state: item });
        },
      };
    });
  }, [navigate]);

  return isNotLessThan768 ? (
    <ChatPrivacyPrompt headerTitle={title} goBack={goBack} menuList={menuList} menuItemHeight={menuItemHeight} />
  ) : (
    <ChatPrivacyPopup headerTitle={title} goBack={goBack} menuList={menuList} menuItemHeight={menuItemHeight} />
  );
}
