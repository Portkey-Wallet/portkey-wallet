import './index.less';
import CustomSvg from 'components/CustomSvg';
import NetworkDrawer from '../../NetworkDrawer';
import BackHeader from 'components/BackHeader';
import AddContactForm from '../../components/AddContactForm';
import { IAddContactProps } from '..';

export default function AddContactPopup({
  form,
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
}: IAddContactProps) {
  return (
    <div className="add-contact-popup min-width-max-height">
      <div className="add-contact-title">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      <AddContactForm
        form={form}
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
