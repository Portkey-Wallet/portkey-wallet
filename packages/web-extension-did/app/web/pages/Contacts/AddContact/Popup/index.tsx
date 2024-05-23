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
    <div className="add-contact-popup min-width-max-height">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />
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
      <NetworkDrawer
        open={isShowDrawer}
        height={528}
        maskClosable={true}
        placement="bottom"
        onChange={handleNetworkChange}
        onClose={closeDrawer}
      />
    </div>
  );
}
