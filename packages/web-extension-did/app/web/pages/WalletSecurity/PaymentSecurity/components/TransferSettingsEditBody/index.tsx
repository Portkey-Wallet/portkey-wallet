import { Button, Form, FormProps, Input, Switch } from 'antd';
import { ValidData } from 'pages/Contacts/AddContact';
import { useTranslation } from 'react-i18next';
import './index.less';
import { useMemo } from 'react';
import { ITransferSettingsFormInit } from '../TransferSettingsBody';
import { divDecimals } from '@portkey-wallet/utils/converter';
import { NoLimit, SetLimitExplain } from 'constants/security';
import { ITransferLimitRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';

const { Item: FormItem } = Form;

export interface ITransferSettingsEditBodyProps extends FormProps {
  state: ITransferLimitRouteState;
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

  const initValue: ITransferSettingsFormInit = useMemo(
    () => ({
      singleLimit: state.dailyLimit === '-1' ? '' : divDecimals(state.singleLimit, state.decimals).toFixed(),
      dailyLimit: state.dailyLimit === '-1' ? '' : divDecimals(state.dailyLimit, state.decimals).toFixed(),
      restricted: state.restricted,
    }),
    [state.dailyLimit, state.decimals, state.restricted, state.singleLimit],
  );

  return (
    <Form
      form={form}
      autoComplete="off"
      layout="vertical"
      className="flex-column transfer-settings-edit-form"
      initialValues={initValue}
      requiredMark={false}
      onFinish={onFinish}>
      <div className="customer-form form-content">
        <FormItem name="restricted" label={t('Transfer Settings')}>
          <div className="flex-start-center">
            <Switch onChange={onRestrictedChange} checked={restrictedValue} />
            <div className="switch-text">{restrictedValue ? 'ON' : 'OFF'}</div>
          </div>
        </FormItem>

        <div className={!restrictedValue ? 'hidden-form' : ''}>
          <FormItem
            name="singleLimit"
            label={t('Limit per Transaction')}
            validateStatus={validSingleLimit.validateStatus}
            help={validSingleLimit.errorMsg}>
            <Input
              placeholder={t('Enter limit')}
              onChange={(e) => onSingleLimitChange(e.target.value)}
              maxLength={18 - Number(state.decimals)}
              suffix={state?.symbol || ''}
            />
          </FormItem>
          <FormItem
            name="dailyLimit"
            label={t('Daily Limit')}
            validateStatus={validDailyLimit.validateStatus}
            help={validDailyLimit.errorMsg}>
            <Input
              placeholder={t('Enter limit')}
              onChange={(e) => onDailyLimitChange(e.target.value)}
              maxLength={18 - Number(state.decimals)}
              suffix={state?.symbol || ''}
            />
          </FormItem>

          <div className="limit-tip ">{SetLimitExplain}</div>
        </div>

        {!restrictedValue && <div className="limit-tip">{NoLimit}</div>}
      </div>

      <FormItem className="footer-btn-wrap">
        <Button className="footer-btn" type="primary" htmlType="submit" disabled={disable}>
          {t('Send Request')}
        </Button>
      </FormItem>
    </Form>
  );
}
