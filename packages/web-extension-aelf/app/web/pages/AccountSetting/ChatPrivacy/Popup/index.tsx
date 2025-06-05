import CommonHeader from 'components/CommonHeader';
import { IChatPrivacyProps } from '..';
import MenuList from 'pages/components/MenuList';

export default function ChatPrivacyPopup({ headerTitle, goBack, menuList, menuItemHeight }: IChatPrivacyProps) {
  return (
    <div className="min-width-max-height chat-privacy-popup">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />

      {menuList?.length > 0 && <MenuList list={menuList} height={menuItemHeight} />}

      {(!menuList || !Array.isArray(menuList) || menuList?.length === 0) && (
        <div className="flex-center no-login-account">No Login Account</div>
      )}
    </div>
  );
}
