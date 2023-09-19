import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IChatPrivacyProps } from '..';
import './index.less';
import MenuList from 'pages/components/MenuList';

export default function ChatPrivacyPrompt({ headerTitle, goBack, menuList }: IChatPrivacyProps) {
  return (
    <div className="chat-privacy-prompt flex-1">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />

      <MenuList list={menuList} height={53} />
    </div>
  );
}
