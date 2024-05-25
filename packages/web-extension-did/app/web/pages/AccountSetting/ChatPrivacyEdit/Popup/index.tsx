import CommonHeader from 'components/CommonHeader';
import { IChatPrivacyEditProps } from '..';
import ChatPrivacyEditFrom from '../components/ChatPrivacyEditFrom';

export default function ChatPrivacyEditPopup({
  headerTitle,
  goBack,
  state,
  permissionSelected,
  changePermission,
}: IChatPrivacyEditProps) {
  return (
    <div className="min-width-max-height chat-privacy-edit-popup">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />
      <ChatPrivacyEditFrom state={state} permissionSelected={permissionSelected} changePermission={changePermission} />
    </div>
  );
}
