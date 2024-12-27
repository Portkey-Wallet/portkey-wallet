import './index.less';
import NetworkDrawer from '../../NetworkDrawer';
import CommonHeader from 'components/CommonHeader';
import AddContactForm from '../../components/AddContactForm';
import { IAddContactProps } from '..';

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
  return (
    <div className="add-contact-popup min-width-max-height">
      <CommonHeader
        title={headerTitle}
        onLeftBack={goBack}
        rightElementList={[
          <div key={'delete'} onClick={deleteContact}>
            delete
          </div>,
        ]}
      />
      <AddContactForm
        form={form}
        isDisable={isDisable}
        validName={validName}
        state={state}
        extra={extra}
        onFinish={onFinish}
        handleAddressInfoChange={handleAddressInfoChange}
        handleNetworkModalState={handleNetworkModalState}
      />
      <NetworkDrawer
        open={isNetworkModalOpen}
        height={528}
        maskClosable={true}
        placement="bottom"
        onChange={(v) => {
          const _addressInfo = form?.getFieldValue('addressInfo');
          handleAddressInfoChange({ ..._addressInfo, network: v });
        }}
        onClose={() => handleNetworkModalState(false)}
      />
    </div>
  );
}
