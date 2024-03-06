import { useCommonState } from 'store/Provider/hooks';
import ChatPrivacyPrompt from './Prompt';
import ChatPrivacyPopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { MenuItemInfo } from 'pages/components/MenuList';
import { useEffect, useMemo } from 'react';
import BaseGuardianTypeIcon from 'components/BaseGuardianTypeIcon';
import {
  CONTACT_PERMISSION_LABEL_MAP,
  CONTACT_PRIVACY_TYPE_LABEL_MAP,
} from '@portkey-wallet/constants/constants-ca/contact';
import './index.less';
import { GuardianTypeIcon } from 'components/VerifierPair';
import { useContactPrivacyList } from '@portkey-wallet/hooks/hooks-ca/security';
import { handleErrorMessage } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';

export interface IChatPrivacyProps extends BaseHeaderProps {
  menuList: MenuItemInfo[];
  menuItemHeight: number;
}

export default function ChatPrivacy() {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { list, refresh } = useContactPrivacyList();

  const title = t('Privacy');
  const goBack = () => {
    navigate('/setting/account-setting');
  };
  const menuItemHeight = 92;

  const menuList: MenuItemInfo[] = useMemo(() => {
    return list.map((item) => {
      return {
        key: item.identifier + item.privacyType,
        icon: <BaseGuardianTypeIcon type={GuardianTypeIcon[item.privacyType]} className="info-privacy-icon" />,
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
  }, [list, navigate]);

  useEffect(() => {
    refresh().catch((error) => {
      const msg = handleErrorMessage(error);
      singleMessage.error(msg);
    });
  }, [refresh]);

  return isNotLessThan768 ? (
    <ChatPrivacyPrompt headerTitle={title} goBack={goBack} menuList={menuList} menuItemHeight={menuItemHeight} />
  ) : (
    <ChatPrivacyPopup headerTitle={title} goBack={goBack} menuList={menuList} menuItemHeight={menuItemHeight} />
  );
}
