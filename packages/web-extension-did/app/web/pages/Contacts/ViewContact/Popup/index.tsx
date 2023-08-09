import { Button } from 'antd';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import ContactAddressList from 'pages/Contacts/components/ContactAddressList';
import './index.less';
import { IViewContactProps } from '..';

export default function ViewContactPopup({
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
    <div className="view-contact-popup">
      <div className="view-contact-nav">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
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
        <Button type="primary" htmlType="submit" onClick={handleEdit}>
          {editText}
        </Button>
        <Button type="primary" htmlType="submit" onClick={handleChat}>
          {chatText}
        </Button>
        <Button type="primary" htmlType="submit" onClick={handleAdd}>
          {addContactText}
        </Button>
      </div>
    </div>
  );
}
