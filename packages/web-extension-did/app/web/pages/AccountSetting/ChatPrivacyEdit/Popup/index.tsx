import BackHeader from 'components/BackHeader';
import { IChatPrivacyEditProps } from '..';
import CustomSvg from 'components/CustomSvg';
import './index.less';
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
      <div className="chat-privacy-edit-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      <ChatPrivacyEditFrom state={state} permissionSelected={permissionSelected} changePermission={changePermission} />
    </div>
  );
}
