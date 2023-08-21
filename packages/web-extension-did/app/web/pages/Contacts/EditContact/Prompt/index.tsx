import './index.less';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IEditContactProps } from '..';
import EditContactForm from 'pages/Contacts/components/EditContactForm';

export default function EditContactPrompt({
  form,
  isShowRemark,
  canSave,
  state,
  validName,
  validRemark,
  headerTitle,
  goBack,
  onFinish,
  handleInputRemarkChange,
  handleCopy,
}: IEditContactProps) {
  return (
    <div className="edit-contact-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <EditContactForm
        form={form}
        isShowRemark={isShowRemark}
        canSave={canSave}
        validName={validName}
        validRemark={validRemark}
        state={state}
        onFinish={onFinish}
        handleInputRemarkChange={handleInputRemarkChange}
        handleCopy={handleCopy}
      />
    </div>
  );
}
