import CommonHeader from 'components/CommonHeader';
import SetNewPinForm from 'pages/My/SettingList/Security/components/SetNewPinForm';
import { ISetNewPinProps } from '..';
import './index.less';

export default function SetNewPinPopup({
  form,
  headerTitle,
  goBack,
  setPinLabel,
  confirmPinLabel,
  btnText,
  onSave,
}: ISetNewPinProps) {
  return (
    <div className="set-new-pin-popup min-width-max-height">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />
      <div className="pin-edit-title font-bg">Create a new PIN to protect your wallet</div>
      <SetNewPinForm
        form={form}
        setPinLabel={setPinLabel}
        confirmPinLabel={confirmPinLabel}
        btnText={btnText}
        onSave={onSave}
      />
    </div>
  );
}
