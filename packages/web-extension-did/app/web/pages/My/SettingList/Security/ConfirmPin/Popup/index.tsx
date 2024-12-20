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
    // <div className="min-width-max-height confirm-pin-popup">
    <div className="confirm-pin-popup">
      <div>
        <CommonHeader title={headerTitle} onLeftBack={goBack} />
        <div className="pin-edit-title font-bg">Enter your current PIN</div>
      </div>
      <div className="confirm-pin-edit-container">
        <Form form={form} colon={false} layout="vertical" onFinish={handleNext} className="confirm-pin-form">
          <div>
            <InputPin label={pinLabel} value={pin} placeholder={placeholder} errMsg={errMsg} onChange={onChangePin} />
          </div>
          <SubmitPinButton text={btnText} disable={submitDisable} className="confirm-pin-btn" />
        </Form>
        {/*<div className="forget-content">*/}
        {/*  <div>Forget your PIN?</div>*/}
        {/*  <div className="logback">Log back in</div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
