import './index.less';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IEditContactProps } from '..';
import EditContactForm from 'pages/Contacts/components/EditContactForm';

export default function EditContactPrompt({
  form,
  isShowRemark,
  cantSave,
  state,
  validName,
  validRemark,
  headerTitle,
  goBack,
  onFinish,
  handleInputRemarkChange,
}: IEditContactProps) {
  return (
    <div className="edit-contact-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <EditContactForm
        form={form}
        isShowRemark={isShowRemark}
        cantSave={cantSave}
        validName={validName}
        validRemark={validRemark}
        state={state}
        onFinish={onFinish}
        handleInputRemarkChange={handleInputRemarkChange}
      />
    </div>
  );
}
