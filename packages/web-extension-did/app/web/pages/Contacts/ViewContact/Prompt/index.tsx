import './index.less';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IViewContactProps } from '..';
import ViewContactBody from 'pages/Contacts/components/ViewContactBody';

export default function ViewContactPrompt({
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
  handleCopy,
}: IViewContactProps) {
  return (
    <div className="view-contact-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <ViewContactBody
        data={data}
        editText={editText}
        chatText={chatText}
        addedText={addedText}
        addContactText={addContactText}
        handleEdit={handleEdit}
        handleChat={handleChat}
        handleAdd={handleAdd}
        handleCopy={handleCopy}
      />
    </div>
  );
}
