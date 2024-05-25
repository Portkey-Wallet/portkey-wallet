import CommonHeader from 'components/CommonHeader';
import './index.less';
import ViewContactBody from 'pages/Contacts/components/ViewContactBody';
import { IProfileDetailProps } from 'types/Profile';

export default function ViewContactPopup({
  headerTitle,
  goBack,
  data,
  editText,
  chatText,
  addedText,
  addContactText,
  handleEdit,
  handleChat,
  handleAdd,
}: IProfileDetailProps) {
  return (
    <div className="view-contact-popup">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />
      <ViewContactBody
        data={data}
        editText={editText}
        chatText={chatText}
        addedText={addedText}
        addContactText={addContactText}
        handleEdit={handleEdit}
        handleChat={handleChat}
        handleAdd={handleAdd}
      />
    </div>
  );
}
