import { Form, Button, FormProps } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import clsx from 'clsx';
import ConfirmPassword from 'components/ConfirmPassword';
import { useCommonState } from 'store/Provider/hooks';
import { ReactNode } from 'react';
import './index.less';

export interface ISetNewPinFormProps extends FormProps {
  onSave: () => void;
  setPinLabel: ReactNode; //'Please enter a new pin'
  confirmPinLabel: ReactNode; //'Confirm new pin'
  btnText: string; //'Save'
}
export default function SetNewPinForm({
  form,
  onFinishFailed,
  onSave,
  setPinLabel,
  confirmPinLabel,
  btnText,
}: ISetNewPinFormProps) {
  const { isNotLessThan768 } = useCommonState();

  return (
    <Form
      className={clsx(['set-pin-form', isNotLessThan768 ? 'set-pin-form-prompt' : null])}
      name="SetPinForm"
      form={form}
      requiredMark={false}
      layout="vertical"
      onFinish={onSave}
      onFinishFailed={onFinishFailed}
      autoComplete="off">
      <div className="form-content">
        <ConfirmPassword
          label={{
            password: setPinLabel,
            confirmPassword: <div className="new-pin-label">{confirmPinLabel}</div>,
          }}
          validateFields={form?.validateFields}
          isPasswordLengthTipShow={true}
        />
      </div>
      <div className="form-footer">
        <FormItem shouldUpdate>
          {() => (
            <Button
              className="submit-btn"
              type="primary"
              htmlType="submit"
              disabled={
                !form?.isFieldsTouched(true) || !!form?.getFieldsError().filter(({ errors }) => errors.length).length
              }>
              {btnText}
            </Button>
          )}
        </FormItem>
      </div>
    </Form>
  );
}
