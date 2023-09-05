import { Button, Form, FormProps, Input, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import './index.less';
import { IPaymentSecurityItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { useMemo } from 'react';
import { AmountSign, formatWithCommas } from '@portkey-wallet/utils/converter';

const { Item: FormItem } = Form;

export interface ITransferSettingsBodyProps extends FormProps {
  state: IPaymentSecurityItem;
  onEdit: () => void;
}

interface ITransferSettingsFormInit {
  singleLimit: string;
  dailyLimit: string;
  restricted: boolean;
}

export default function TransferSettingsBody({ form, state, onEdit }: ITransferSettingsBodyProps) {
  const { t } = useTranslation();

  const initValue: ITransferSettingsFormInit = useMemo(() => {
    return {
      singleLimit:
        formatWithCommas({ amount: state.singleLimit, decimals: 0, digits: 0, sign: AmountSign.EMPTY }) +
        ' ' +
        state.symbol, // TODO format
      dailyLimit:
        formatWithCommas({ amount: state.dailyLimit, decimals: 0, digits: 0, sign: AmountSign.EMPTY }) +
        ' ' +
        state.symbol, // TODO format
      restricted: state.restricted,
    };
  }, [state.dailyLimit, state.restricted, state.singleLimit, state.symbol]);

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
            <FormItem name="restricted" label={t('Transfer settings')}>
              <div className="flex-start-center">
                <Switch checked={false} disabled={true} />
                <div className="switch-text">{'Off'}</div>
              </div>
            </FormItem>
            <div className="limit-tip">{`No limit for transfer`}</div>
          </>
        )}

        {state.restricted && (
          <>
            <FormItem name="singleLimit" label={t('Limit per transaction')}>
              <Input
                placeholder={t('Enter limit')}
                disabled={true}
                value={state.singleLimit + ' ' + state.symbol}
                defaultValue={state.singleLimit + ' ' + state.symbol}
              />
            </FormItem>
            <FormItem name="dailyLimit" label={t('Daily limit')}>
              <Input placeholder={t('Enter limit')} disabled={true} />
            </FormItem>
            <div className="limit-tip">
              {`Transfers within the limits do not require guardian approval, but if exceed, you need to modify the settings.`}
            </div>
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
