import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IChatPrivacyProps } from '..';
import './index.less';
import MenuList from 'pages/components/MenuList';

export default function ChatPrivacyPrompt({ headerTitle, goBack, menuList, menuItemHeight }: IChatPrivacyProps) {
  return (
    <div className="chat-privacy-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />

      {menuList?.length > 0 && <MenuList list={menuList} height={menuItemHeight} />}

      {(!menuList || !Array.isArray(menuList) || menuList?.length === 0) && (
        <div className="flex-center no-login-account">No Login Account</div>
      )}
    </div>
  );
}
