import './index.less';
import CustomSvg from 'components/CustomSvg';
import BackHeader from 'components/BackHeader';
import { IEditContactProps } from '..';
import EditContactForm from 'pages/Contacts/components/EditContactForm';

export default function EditContactPopup({
  form,
  isNameDisable,
  isShowRemark,
  canSave,
  state,
  validName,
  validRemark,
  headerTitle,
  goBack,
  onFinish,
  handleInputValueChange,
  handleInputRemarkChange,
  handleCopy,
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
        isNameDisable={isNameDisable}
        isShowRemark={isShowRemark}
        canSave={canSave}
        validName={validName}
        validRemark={validRemark}
        state={state}
        onFinish={onFinish}
        handleInputValueChange={handleInputValueChange}
        handleInputRemarkChange={handleInputRemarkChange}
        handleCopy={handleCopy}
      />
    </div>
  );
}
