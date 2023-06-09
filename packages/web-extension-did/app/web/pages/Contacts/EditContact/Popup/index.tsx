import './index.less';
import CustomSvg from 'components/CustomSvg';
import NetworkDrawer from '../../NetworkDrawer';
import BackHeader from 'components/BackHeader';
import EditContactForm from '../../components/EditContactForm';
import { IEditContactProps } from '..';

export default function EditContactPopup({
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
    <div className="edit-contact-popup min-width-max-height">
      <div className="edit-contact-title">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
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
