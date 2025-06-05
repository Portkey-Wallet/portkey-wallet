import './index.less';
import CommonHeader from 'components/CommonHeader';
import { IEditContactProps } from '..';
import EditContactForm from 'pages/Contacts/components/EditContactForm';

export default function EditContactPopup({
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
    <div className="edit-contact-popup min-width-max-height">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />
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
