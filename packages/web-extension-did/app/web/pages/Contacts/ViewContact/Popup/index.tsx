import { Button } from 'antd';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import ContactAddressList from 'pages/Contacts/components/ContactAddressList';
import './index.less';
import { IViewContactProps } from '..';

export default function ViewContactPopup({ headerTitle, goBack, data, editText, handleEdit }: IViewContactProps) {
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
      <div className="contact-body">
        <Button type="primary" htmlType="submit" onClick={handleEdit}>
          {editText}
        </Button>
        <ContactAddressList list={data.addresses} />
      </div>
    </div>
  );
}
