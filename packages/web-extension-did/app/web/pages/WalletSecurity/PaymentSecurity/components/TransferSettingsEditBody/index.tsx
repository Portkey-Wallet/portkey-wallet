import { Button, Form, FormProps, Input } from 'antd';
import { ValidData } from 'pages/Contacts/AddContact';
import { useTranslation } from 'react-i18next';
import './index.less';
import { useMemo, useState } from 'react';
import { ITransferSettingsFormInit } from '../TransferSettingsBody';
import { divDecimals } from '@portkey-wallet/utils/converter';
import { ITransferLimitRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { isValidInteger } from '@portkey-wallet/utils/reg';
import { LimitFormatTip } from 'constants/security';
import BigNumber from 'bignumber.js';

const { Item: FormItem } = Form;

export interface ITransferSettingsEditBodyProps extends FormProps {
  state: ITransferLimitRouteState;
  restrictedValue: boolean;
  disable?: boolean;
  validSingleLimit?: ValidData;
  validDailyLimit?: ValidData;
  onRestrictedChange?: (checked: boolean) => void;
  onSingleLimitChange: (v: string) => void;
  onDailyLimitChange: (v: string) => void;
  onFinish: () => void;
}

export default function TransferSettingsEditBody({
  form,
  // restrictedValue,
  state,
  // disable,
  // validSingleLimit,
  // validDailyLimit,
  // onRestrictedChange,
  onSingleLimitChange,
  onDailyLimitChange,
  onFinish,
}: ITransferSettingsEditBodyProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);

  const initValue: ITransferSettingsFormInit = useMemo(
    () => ({
      singleLimit: state.dailyLimit === '-1' ? '' : divDecimals(state.singleLimit, state.decimals).toFixed(),
      dailyLimit: state.dailyLimit === '-1' ? '' : divDecimals(state.dailyLimit, state.decimals).toFixed(),
      restricted: state.restricted,
    }),
    [state.dailyLimit, state.decimals, state.restricted, state.singleLimit],
  );

  const validateNumberGreaterThanZero = (_: any, value: string | undefined) => {
    if (isValidInteger(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(LimitFormatTip));
    // return Promise.reject(new Error('LimitFormatTip'));
  };

  return (
    <Form
      form={form}
      autoComplete="off"
      layout="vertical"
      className="flex-column transfer-settings-edit-form"
      initialValues={initValue}
      onValuesChange={async () => {
        console.log('data update ');
        if (!form) {
          return;
        }
        try {
          const values = await form.validateFields();
          console.log('Success:', values);
          setDisable(false);
        } catch (errorInfo: any) {
          console.log('Failed:', errorInfo);
          if (errorInfo && errorInfo.errorFields && errorInfo.errorFields.length > 0) {
            setDisable(true);
          } else {
            setDisable(false);
          }
        }
      }}
      requiredMark={false}
      onFinish={async () => {
        setLoading(true);
        await onFinish();
        setLoading(false);
      }}>
      <div className="customer-form form-content">
        <div>
          <FormItem
            name="singleLimit"
            label={t('Limit per Transaction')}
            rules={[
              {
                validator: validateNumberGreaterThanZero,
              },
              {
                validator: (_, value) => {
                  if (BigNumber(value).isGreaterThan(divDecimals(state.dailyLimit, state.decimals))) {
                    return Promise.reject(new Error(t('Cannot exceed the daily limit.')));
                  }
                  return Promise.resolve();
                },
              },
            ]}>
            <Input
              placeholder={t('Enter amount')}
              onChange={(e) => onSingleLimitChange(e.target.value)}
              maxLength={18 - Number(state.decimals)}
              suffix={state?.symbol || ''}
            />
          </FormItem>
          <div className="blank" />
          <FormItem
            name="dailyLimit"
            label={t('Daily Limit')}
            rules={[
              {
                validator: validateNumberGreaterThanZero,
              },
            ]}>
            <Input
              placeholder={t('Enter amount')}
              onChange={(e) => onDailyLimitChange(e.target.value)}
              maxLength={18 - Number(state.decimals)}
              suffix={state?.symbol || ''}
            />
          </FormItem>
        </div>
      </div>

      <FormItem className="footer-btn-wrap">
        <Button className="footer-btn" type="primary" htmlType="submit" disabled={disable} loading={loading}>
          {t('Verify with guardian')}
        </Button>
      </FormItem>
    </Form>
  );
}
