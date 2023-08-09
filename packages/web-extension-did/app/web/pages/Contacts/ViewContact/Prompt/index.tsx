import { Button } from 'antd';
import './index.less';
import ContactAddressList from 'pages/Contacts/components/ContactAddressList';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IViewContactProps } from '..';
import CustomSvg from 'components/CustomSvg';

export default function ViewContactPrompt({
  headerTitle,
  goBack,
  data,
  editText,
  chatText,
  addContactText,
  handleEdit,
  handleChat,
  handleAdd,
  handleCopy,
}: IViewContactProps) {
  return (
    <div className="view-contact-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />

      <div className="name-section">
        <div className="flex-center name-index">{data.index}</div>
        <div className="name">{data.name}</div>
      </div>

      <div className="name-section">
        <span>Remark</span>
        <span>{data.remark}</span>
      </div>

      <div className="name-section">
        <span>Portkey ID</span>
        <div>
          <span>{data.portkeyId}</span>
          <CustomSvg onClick={() => handleCopy(data.portkeyId)} type="Copy" className="address-copy-icon" />
        </div>
      </div>

      <div className="name-section">
        <span>{`ID (relation one)`}</span>
        <div>
          <span>{data.relationOneId}</span>
          <CustomSvg onClick={() => handleCopy(data.relationOneId)} type="Copy" className="address-copy-icon" />
        </div>
      </div>

      <div className="contact-body">
        <ContactAddressList list={data.addresses} />
        <Button type="primary" htmlType="submit" className="edit-btn" onClick={handleEdit}>
          {editText}
        </Button>
        <Button type="primary" htmlType="submit" className="chat-btn" onClick={handleChat}>
          {chatText}
        </Button>
        <Button type="primary" htmlType="submit" className="add-contact-btn" onClick={handleAdd}>
          {addContactText}
        </Button>
      </div>
    </div>
  );
}
