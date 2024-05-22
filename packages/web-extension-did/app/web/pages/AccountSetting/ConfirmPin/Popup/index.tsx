import CommonHeader from 'components/CommonHeader';
import './index.less';
import { IConfirmPinProps } from '..';
import SubmitPinButton from 'pages/AccountSetting/components/SubmitPinButton';
import InputPin from 'pages/AccountSetting/components/InputPin';
import { Form } from 'antd';

export default function ConfirmPinPopup({
  headerTitle,
  pinLabel,
  pin,
  placeholder,
  errMsg,
  submitDisable,
  btnText,
  onChangePin,
  handleNext,
  goBack,
}: IConfirmPinProps) {
  const [form] = Form.useForm();

  return (
    <div className="min-width-max-height confirm-pin-popup">
      <Form
        form={form}
        colon={false}
        layout="vertical"
        onFinish={handleNext}
        className="flex-column-between confirm-pin-form">
        <div>
          <CommonHeader title={headerTitle} onLeftBack={goBack} />
          <InputPin label={pinLabel} value={pin} placeholder={placeholder} errMsg={errMsg} onChange={onChangePin} />
        </div>
        <SubmitPinButton text={btnText} disable={submitDisable} className="confirm-pin-btn" />
      </Form>
    </div>
  );
}
