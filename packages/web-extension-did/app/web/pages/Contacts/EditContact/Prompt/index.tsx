import './index.less';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IEditContactProps } from '..';
import EditContactForm from 'pages/Contacts/components/EditContactForm';

export default function EditContactPrompt({
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
    <div className="edit-contact-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
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
