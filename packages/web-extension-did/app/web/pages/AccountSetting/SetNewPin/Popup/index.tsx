import CommonHeader from 'components/CommonHeader';
import SetNewPinForm from 'pages/AccountSetting/components/SetNewPinForm';
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
