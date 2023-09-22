import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IChatPrivacyProps } from '..';
import './index.less';
import MenuList from 'pages/components/MenuList';

export default function ChatPrivacyPrompt({ headerTitle, goBack, menuList, menuItemHeight }: IChatPrivacyProps) {
  return (
    <div className="chat-privacy-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />

      <MenuList list={menuList} height={menuItemHeight} />
    </div>
  );
}
