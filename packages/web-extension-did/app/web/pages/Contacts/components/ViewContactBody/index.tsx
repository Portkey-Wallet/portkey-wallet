import { Button } from 'antd';
import './index.less';
import ContactAddressList from 'pages/Contacts/components/ContactAddressList';
import CustomSvg from 'components/CustomSvg';
import { AddressItem } from '@portkey-wallet/types/types-ca/contact';

export interface IViewContactBodyProps {
  data: {
    name: string;
    remark: string;
    portkeyId: string;
    relationOneId: string;
    index: string;
    addresses: AddressItem[];
  };
  editText: string;
  chatText: string;
  addedText: string;
  addContactText: string;
  handleEdit: () => void;
  handleChat: () => void;
  handleAdd: () => void;
  handleCopy: (v: string) => void;
}

export default function ViewContactBody({
  data,
  editText,
  chatText,
  addedText,
  addContactText,
  handleEdit,
  handleChat,
  handleAdd,
  handleCopy,
}: IViewContactBodyProps) {
  return (
    <div className="flex-column-between view-contact-body">
      <div className="view-contact-body-main">
        <div className="info-section name-section">
          <div className="flex-center name-index">{data.index}</div>
          <div className="name">{data.name}</div>
          <div className="remark">
            <span>{`Remark: `}</span>
            <span>{data?.remark || 'No set'}</span>
          </div>

          <div className="flex-center action">
            <div className="flex-column-center action-item added-contact">
              <CustomSvg type="ContactAdded" />
              <span>{addedText}</span>
            </div>
            <div className="flex-column-center action-item add-contact" onClick={handleAdd}>
              <CustomSvg type="ContactAdd" />
              <span>{addContactText}</span>
            </div>
            <div className="flex-column-center action-item chat-contact" onClick={handleChat}>
              <CustomSvg type="ContactChat" />
              <span>{chatText}</span>
            </div>
          </div>
        </div>

        <div className="info-section section-border-bottom">
          <div className="info-title">Portkey ID</div>
          <div className="flex-row-between info-content">
            <div className="info-desc">{data.portkeyId}</div>
            <CustomSvg onClick={() => handleCopy(data.portkeyId)} type="Copy" className="id-copy-icon" />
          </div>
        </div>

        <div className="info-section section-border-bottom">
          <div className="info-title">{`ID (relation one)`}</div>
          <div className="flex-row-between info-content">
            <div className="info-desc">{data.relationOneId}</div>
            <CustomSvg onClick={() => handleCopy(data.relationOneId)} type="Copy" className="id-copy-icon" />
          </div>
        </div>

        <div className="info-section">
          <div className="info-title">{`DID`}</div>
          <ContactAddressList list={data.addresses} />
        </div>
      </div>
      <div className="footer">
        <Button type="primary" htmlType="submit" className="edit-btn" onClick={handleEdit}>
          {editText}
        </Button>
      </div>
    </div>
  );
}
