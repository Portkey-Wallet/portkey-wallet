import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
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
      <div className="view-contact-nav">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
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
