import { Button, Form, FormProps, Input, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import './index.less';
import { useMemo } from 'react';
import { AmountSign, formatWithCommas } from '@portkey-wallet/utils/converter';
import { NoLimit, SetLimitExplain } from 'constants/security';
import { IPaymentSecurityRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';

const { Item: FormItem } = Form;

export interface ITransferSettingsBodyProps extends FormProps {
  state: IPaymentSecurityRouteState;
  onEdit: () => void;
}

export interface ITransferSettingsFormInit {
  singleLimit: string;
  dailyLimit: string;
  restricted: boolean;
}

export default function TransferSettingsBody({ form, state, onEdit }: ITransferSettingsBodyProps) {
  const { t } = useTranslation();

  const initValue: ITransferSettingsFormInit = useMemo(() => {
    return {
      singleLimit:
        formatWithCommas({ amount: state.singleLimit, decimals: state?.decimals, digits: 0, sign: AmountSign.EMPTY }) +
        ' ' +
        state.symbol, // TODO format
      dailyLimit:
        formatWithCommas({ amount: state.dailyLimit, decimals: state?.decimals, digits: 0, sign: AmountSign.EMPTY }) +
        ' ' +
        state.symbol, // TODO format
      restricted: state.restricted,
    };
  }, [state.dailyLimit, state?.decimals, state.restricted, state.singleLimit, state.symbol]);

  return (
    <Form
      form={form}
      autoComplete="off"
      layout="vertical"
      className="flex-column transfer-settings-form"
      initialValues={initValue}
      requiredMark={false}>
      <div className="customer-form form-content">
        {!state.restricted && (
          <>
            <FormItem name="restricted" label={t('Transfer Settings')}>
              <div className="flex-start-center">
                <Switch checked={false} disabled={true} />
                <div className="switch-text">{'OFF'}</div>
              </div>
            </FormItem>
            <div className="limit-tip">{NoLimit}</div>
          </>
        )}

        {state.restricted && (
          <>
            <FormItem name="singleLimit" label={t('Limit per Transaction')}>
              <Input
                placeholder={t('Enter limit')}
                disabled={true}
                value={state.singleLimit + ' ' + state.symbol}
                defaultValue={state.singleLimit + ' ' + state.symbol}
              />
            </FormItem>
            <FormItem name="dailyLimit" label={t('Daily Limit')}>
              <Input placeholder={t('Enter limit')} disabled={true} />
            </FormItem>
            <div className="limit-tip">{SetLimitExplain}</div>
          </>
        )}
      </div>

      <FormItem className="footer-btn-wrap">
        <Button className="footer-btn" type="primary" onClick={onEdit}>
          {t('Edit')}
        </Button>
      </FormItem>
    </Form>
  );
}
