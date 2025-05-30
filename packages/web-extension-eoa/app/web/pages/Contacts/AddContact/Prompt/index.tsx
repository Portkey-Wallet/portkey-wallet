import './index.less';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import AddContactForm from 'pages/Contacts/components/AddContactForm';
import { IAddContactProps } from '..';
import NetworkModal from 'pages/Contacts/NetworkModal';

export default function AddContactPrompt({
  form,
  isDisable,
  state,
  extra,
  addressArr,
  validName,
  headerTitle,
  isShowDrawer,
  goBack,
  onFinish,
  handleInputValueChange,
  handleSelectNetwork,
  handleAddressChange,
  closeDrawer,
  handleNetworkChange,
}: IAddContactProps) {
  return (
    <div className="add-contact-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <AddContactForm
        form={form}
        isDisable={isDisable}
        validName={validName}
        state={state}
        extra={extra}
        addressArr={addressArr}
        onFinish={onFinish}
        handleSelectNetwork={handleSelectNetwork}
        handleAddressChange={handleAddressChange}
        handleInputValueChange={handleInputValueChange}
      />
      <NetworkModal open={isShowDrawer} onChange={handleNetworkChange} onClose={closeDrawer} />
    </div>
  );
}
