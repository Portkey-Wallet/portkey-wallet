import { useState } from 'react';
import { Modal, Button } from 'antd';
import { JOIN_OFFICIAL_GROUP_CONTENT, JOIN_OFFICIAL_GROUP_TITLE } from '@portkey-wallet/constants/constants-ca/guide';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';

const CustomModal = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => {
    setIsVisible(true);
  };

  const handleOk = () => {
    console.log('success');
    setIsVisible(false);
  };

  const handleCancel = () => {
    console.log('fail');
    setIsVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        显示模态框
      </Button>
      <Modal
        className="portkey-custom-modal"
        closable={false}
        // title="message title"
        visible={isVisible}
        // onOk={handleOk}
        // onCancel={handleCancel}
        bodyStyle={{ padding: 0 }}
        footer={
          <div>
            <Button key="submit" type="primary" onClick={handleOk}>
              ok
            </Button>
            ,
            <Button key="extra" onClick={handleCancel}>
              cancel
            </Button>
          </div>
        }>
        <div className="join-official-group-tip-modal-container">
          <CustomSvg
            type="CloseNew"
            onClick={() => {
              setIsVisible(false);
              handleCancel();
            }}
          />
          <div className="flex-center join-official-group-icon">
            <CustomSvg type="JoinOfficialGroup" />
          </div>
          <div className="modal-title">{t(JOIN_OFFICIAL_GROUP_TITLE)}</div>
          <div className="modal-content flex-column">{t(JOIN_OFFICIAL_GROUP_CONTENT)}</div>
        </div>
      </Modal>
    </>
  );
};

export default CustomModal;
