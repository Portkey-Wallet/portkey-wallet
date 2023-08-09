import './index.less';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import EditContactForm from 'pages/Contacts/components/EditContactForm';
import { IEditContactProps } from '..';
import NetworkModal from 'pages/Contacts/NetworkModal';

export default function EditContactPrompt({
  form,
  isEdit,
  isDisable,
  state,
  addressArr,
  validName,
  validRemark,
  headerTitle,
  isShowDrawer,
  goBack,
  onFinish,
  handleInputValueChange,
  handleInputRemarkChange,
  handleSelectNetwork,
  handleAddressChange,
  closeDrawer,
  handleNetworkChange,
}: IEditContactProps) {
  return (
    <div className="edit-contact-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <EditContactForm
        form={form}
        isEdit={isEdit}
        isDisable={isDisable}
        validName={validName}
        validRemark={validRemark}
        state={state}
        addressArr={addressArr}
        onFinish={onFinish}
        handleSelectNetwork={handleSelectNetwork}
        handleAddressChange={handleAddressChange}
        handleInputValueChange={handleInputValueChange}
        handleInputRemarkChange={handleInputRemarkChange}
      />
      <NetworkModal open={isShowDrawer} onChange={handleNetworkChange} onClose={closeDrawer} />
    </div>
  );
}
