import { Button } from 'antd';
import './index.less';
import ContactAddressList from 'pages/Contacts/components/ContactAddressList';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IViewContactProps } from '..';

export default function ViewContactPrompt({ headerTitle, goBack, data, editText, handleEdit }: IViewContactProps) {
  return (
    <div className="view-contact-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />

      <div className="name-section">
        <div className="flex-center name-index">{data.index}</div>
        <div className="name">{data.name}</div>
      </div>

      <div className="contact-body">
        <Button type="primary" htmlType="submit" className="edit-btn" onClick={handleEdit}>
          {editText}
        </Button>
        <ContactAddressList list={data.addresses} />
      </div>
    </div>
  );
}
