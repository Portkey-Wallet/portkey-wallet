import { Button, Form, FormProps, Input } from 'antd';
import { ValidData } from 'pages/Contacts/AddContact';
import { useTranslation } from 'react-i18next';
import './index.less';

const { Item: FormItem } = Form;

export interface ITransferSettingsBodyProps extends FormProps {
  state: any;
  disable: boolean;
  validSingleLimit: ValidData;
  validDailyLimit: ValidData;
  onSingleLimitChange: (v: string) => void;
  onDailyLimitChange: (v: string) => void;
  onFinish: () => void;
}

export default function TransferSettingsBody({
  form,
  state,
  disable,
  validSingleLimit,
  validDailyLimit,
  onSingleLimitChange,
  onDailyLimitChange,
  onFinish,
}: ITransferSettingsBodyProps) {
  const { t } = useTranslation();

  return (
    <Form
      form={form}
      autoComplete="off"
      layout="vertical"
      className="flex-column transfer-settings-form"
      initialValues={state}
      requiredMark={false}
      onFinish={onFinish}>
      <div className="form-content">
        <FormItem name="transferSettings" label={t('Transfer settings')}>
          {/* transferSettings */}
        </FormItem>
        <FormItem
          name="singleLimit"
          label={t('Limit per transaction')}
          validateStatus={validSingleLimit.validateStatus}
          help={validSingleLimit.errorMsg}>
          <Input placeholder={t('Enter limit')} onChange={(e) => onSingleLimitChange(e.target.value)} maxLength={16} />
        </FormItem>
        <FormItem
          name="dailyLimit"
          label={t('Daily limit')}
          validateStatus={validDailyLimit.validateStatus}
          help={validDailyLimit.errorMsg}>
          <Input placeholder={t('Enter limit')} onChange={(e) => onDailyLimitChange(e.target.value)} maxLength={16} />
        </FormItem>

        <div>transfers tip</div>
      </div>

      <FormItem className="form-btn">
        <Button className="send-btn" type="primary" htmlType="submit" disabled={disable}>
          {t('Send Request')}
        </Button>
      </FormItem>
    </Form>
  );
}
