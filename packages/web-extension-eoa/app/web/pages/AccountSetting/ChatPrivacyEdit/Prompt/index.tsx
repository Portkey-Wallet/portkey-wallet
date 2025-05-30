import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IChatPrivacyEditProps } from '..';
import './index.less';
import ChatPrivacyEditFrom from '../components/ChatPrivacyEditFrom';

export default function ChatPrivacyEditPrompt({
  headerTitle,
  goBack,
  state,
  permissionSelected,
  changePermission,
}: IChatPrivacyEditProps) {
  return (
    <div className="chat-privacy-edit-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <ChatPrivacyEditFrom state={state} permissionSelected={permissionSelected} changePermission={changePermission} />
    </div>
  );
}
