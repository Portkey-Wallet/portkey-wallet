import { Form } from 'antd';
import InputPin from 'pages/AccountSetting/components/InputPin';
import SubmitPinButton from 'pages/AccountSetting/components/SubmitPinButton';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IConfirmPinProps } from '..';
import './index.less';

export default function ConfirmPinPrompt({
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
    <div className="confirm-pin-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <Form form={form} colon={false} layout="vertical" onFinish={handleNext}>
        <InputPin label={pinLabel} value={pin} placeholder={placeholder} errMsg={errMsg} onChange={onChangePin} />
        <SubmitPinButton text={btnText} disable={submitDisable} className="confirm-pin-btn" />
      </Form>
    </div>
  );
}
