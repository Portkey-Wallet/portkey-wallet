import './index.less';
// import NetworkDrawer from '../../NetworkDrawer';
import CommonHeader from 'components/CommonHeader';
import AddContactForm from '../../components/AddContactForm';
import { IAddContactProps } from '..';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useState } from 'react';
import { CommonModal } from '@portkey/did-ui-react';
import { Button } from 'antd';
// import { useContactNetworkConfig } from '@portkey-wallet/hooks/hooks-ca/config';

export default function AddContactPopup({
  form,
  isDisable,
  state,
  extra,
  validName,
  headerTitle,
  goBack,
  onFinish,
  handleAddressInfoChange,
  isNetworkModalOpen,
  handleNetworkModalState,
  deleteContact,
}: IAddContactProps) {
  console.log('extra', extra);
  const [removeTip, setRemoveTip] = useState(false);
  // const { supportNetworkList } = useContactNetworkConfig();

  return (
    <div className="add-contact-popup min-width-max-height">
      <CommonHeader
        title={headerTitle}
        onLeftBack={goBack}
        rightElementList={[
          extra == 'edit-contact' && (
            <CustomSvgV3 type="delete" fillColor="#EB7D50" onClick={() => setRemoveTip(true)} />
          ),
        ]}
      />
      <AddContactForm
        form={form}
        isDisable={isDisable}
        validName={validName}
        state={state}
        extra={extra}
        onFinish={onFinish}
        isNetworkModalOpen={isNetworkModalOpen}
        handleAddressInfoChange={handleAddressInfoChange}
        handleNetworkModalState={handleNetworkModalState}
      />
      {/* <NetworkDrawer
        open={isNetworkModalOpen}
        height={528}
        maskClosable={true}
        placement="bottom"
        onChange={(v) => {
          const _addressInfo = form?.getFieldValue('addressInfo');
          handleAddressInfoChange({ ..._addressInfo, network: v });
        }}
        onClose={() => handleNetworkModalState(false)}
      /> */}

      <CommonModal className="remove-tip-modal" open={removeTip} onClose={() => setRemoveTip(false)}>
        <CommonHeader title={<CustomSvgV3 type="error" />} onLeftBackShowClose={true} />
        <div className="remove-content">
          <div className="title">Delete Account Warning</div>
          <div className="desc">Are you sure you want to delete your account? This action is irreversible.</div>
          <div className="btn-box">
            <Button className="cancel" onClick={() => setRemoveTip(false)}>
              Cancel
            </Button>
            <Button className="delete" onClick={deleteContact}>
              Delete
            </Button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}
