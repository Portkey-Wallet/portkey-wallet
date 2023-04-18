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
  headerTitle,
  isShowDrawer,
  goBack,
  onFinish,
  handleInputValueChange,
  handleSelectNetwork,
  handleAddressChange,
  handleDelete,
  handleAdd,
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
        state={state}
        addressArr={addressArr}
        onFinish={onFinish}
        handleDelete={handleDelete}
        handleSelectNetwork={handleSelectNetwork}
        handleAddressChange={handleAddressChange}
        handleAdd={handleAdd}
        handleInputValueChange={handleInputValueChange}
      />
      <NetworkModal open={isShowDrawer} onChange={handleNetworkChange} onClose={closeDrawer} />
    </div>
  );
}
