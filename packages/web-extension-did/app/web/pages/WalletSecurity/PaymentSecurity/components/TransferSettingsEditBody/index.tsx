import { Button, Form, FormProps, Input, Switch } from 'antd';
import { ValidData } from 'pages/Contacts/AddContact';
import { useTranslation } from 'react-i18next';
import './index.less';

const { Item: FormItem } = Form;

export interface ITransferSettingsEditBodyProps extends FormProps {
  state: any;
  restrictedValue: boolean;
  disable: boolean;
  validSingleLimit: ValidData;
  validDailyLimit: ValidData;
  onRestrictedChange: (checked: boolean) => void;
  onSingleLimitChange: (v: string) => void;
  onDailyLimitChange: (v: string) => void;
  onFinish: () => void;
}

export default function TransferSettingsEditBody({
  form,
  restrictedValue,
  state,
  disable,
  validSingleLimit,
  validDailyLimit,
  onRestrictedChange,
  onSingleLimitChange,
  onDailyLimitChange,
  onFinish,
}: ITransferSettingsEditBodyProps) {
  const { t } = useTranslation();

  return (
    <Form
      form={form}
      autoComplete="off"
      layout="vertical"
      className="flex-column transfer-settings-edit-form"
      initialValues={state}
      requiredMark={false}
      onFinish={onFinish}>
      <div className="customer-form form-content">
        <FormItem name="restricted" label={t('Transfer settings')}>
          <div className="flex-start-center">
            <Switch onChange={onRestrictedChange} checked={restrictedValue} />
            <div className="switch-text">{restrictedValue ? 'On' : 'Off'}</div>
          </div>
        </FormItem>

        {restrictedValue && (
          <>
            <FormItem
              name="singleLimit"
              label={t('Limit per transaction')}
              validateStatus={validSingleLimit.validateStatus}
              help={validSingleLimit.errorMsg}>
              <Input
                placeholder={t('Enter limit')}
                onChange={(e) => onSingleLimitChange(e.target.value)}
                maxLength={16}
                suffix={state?.symbol || ''}
              />
            </FormItem>
            <FormItem
              name="dailyLimit"
              label={t('Daily limit')}
              validateStatus={validDailyLimit.validateStatus}
              help={validDailyLimit.errorMsg}>
              <Input
                placeholder={t('Enter limit')}
                onChange={(e) => onDailyLimitChange(e.target.value)}
                maxLength={16}
                suffix={state?.symbol || ''}
              />
            </FormItem>

            <div className="limit-tip ">
              {`Transfers within the limits do not require guardian approval, but if exceed, you need to modify the settings.`}
            </div>
          </>
        )}

        {!restrictedValue && <div className="limit-tip">{`No limit for transfer`}</div>}
      </div>

      <FormItem className="footer-btn-wrap">
        <Button className="footer-btn" type="primary" htmlType="submit" disabled={disable}>
          {t('Send Request')}
        </Button>
      </FormItem>
    </Form>
  );
}
