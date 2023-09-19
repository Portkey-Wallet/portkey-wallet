import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IChatPrivacyEditProps } from '..';
import './index.less';
import ChatPrivacyEditFrom from '../components/ChatPrivacyEditFrom';

export default function ChatPrivacyEditPrompt({ headerTitle, goBack }: IChatPrivacyEditProps) {
  return (
    <div className="chat-privacy-edit-prompt flex-1">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <ChatPrivacyEditFrom />
    </div>
  );
}
