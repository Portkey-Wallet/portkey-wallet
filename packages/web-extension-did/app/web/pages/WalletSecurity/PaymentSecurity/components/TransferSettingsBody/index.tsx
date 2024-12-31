import { Button, Form, FormProps, Modal, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import './index.less';
import { useCallback, useEffect, useState } from 'react';
import { AmountSign, divDecimals, formatWithCommas } from '@portkey-wallet/utils/converter';
import { ITransferLimitRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';
import TokenImageDisplay from '../../../../components/TokenImageDisplay';
import { useSetLimit } from '../../TransferSettings/useSetLimit';
import { CustomModalBottom } from '../../../../components/CustomModalBottom';
import TransferSettingsEditBody from '../TransferSettingsEditBody';
import { ValidData } from 'pages/Contacts/AddContact';
import { LimitFormatTip, SingleExceedDaily } from 'constants/security';
import { isValidInteger } from '@portkey-wallet/utils/reg';
import { useCommonState } from 'store/Provider/hooks';

export interface ITransferSettingsBodyProps extends FormProps {
  state: ITransferLimitRouteState;
  onEdit: () => void;
  chainName?: string;
}

export interface ITransferSettingsFormInit {
  singleLimit: string;
  dailyLimit: string;
  restricted: boolean;
}

export default function TransferSettingsBody({
  state,
  // onEdit,
  chainName,
}: ITransferSettingsBodyProps) {
  const { t } = useTranslation();
  const { isPrompt } = useCommonState();
  const [limitData, setLimitData] = useState<{
    singleLimit: string;
    dailyLimit: string;
    restricted: boolean;
  }>();
  console.log('state.singleLimit: ', state.singleLimit, state.dailyLimit, state);
  const [restrictedText, setRestrictedText] = useState(!!state?.restricted);
  const { handleSetLimit } = useSetLimit();
  const [switchLoading, setSwitchLoading] = useState(false);
  const handleRestrictedChange = useCallback(
    async (checked: boolean) => {
      setSwitchLoading(true);
      try {
        const singleLimit = state.singleLimit === '-1' ? state.defaultSingleLimit : state.singleLimit;
        const dailyLimit = state.dailyLimit === '-1' ? state.defaultDailyLimit : state.dailyLimit;
        await handleSetLimit({
          state,
          singleLimit: divDecimals(singleLimit, state.decimals),
          dailyLimit: divDecimals(dailyLimit, state.decimals),
          restricted: checked,
        });
        setRestrictedText(checked);
      } catch (error) {
        console.log(error);
      }
      setSwitchLoading(false);
      // setRestrictedText(checked);
    },
    [handleSetLimit, state],
  );
  useEffect(() => {
    setRestrictedText(!!state?.restricted);
  }, [state?.restricted]);

  const updateInputValue = useCallback(() => {
    const singleLimit = state.singleLimit === '-1' ? state.defaultSingleLimit : state.singleLimit;
    const dailyLimit = state.dailyLimit === '-1' ? state.defaultDailyLimit : state.dailyLimit;
    const formValue = {
      singleLimit:
        formatWithCommas({ amount: singleLimit, decimals: state?.decimals, digits: 0, sign: AmountSign.EMPTY }) +
        ' ' +
        state.symbol,
      dailyLimit:
        formatWithCommas({ amount: dailyLimit, decimals: state?.decimals, digits: 0, sign: AmountSign.EMPTY }) +
        ' ' +
        state.symbol,
      restricted: state.restricted,
    };
    setLimitData(formValue);
  }, [
    state.dailyLimit,
    state?.decimals,
    state.defaultDailyLimit,
    state.defaultSingleLimit,
    state.restricted,
    state.singleLimit,
    state.symbol,
  ]);

  useEffect(() => {
    updateInputValue();
  }, [updateInputValue]);

  // All logic can be write in TransferSettingsEditBody.
  // Todo: No page use TransferSettingsEditBody, so we can remove it.
  const [form] = Form.useForm();
  const [validSingleLimit, setValidSingleLimit] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const [validDailyLimit, setValidDailyLimit] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const handleFormChange = useCallback(() => {
    const { singleLimit, dailyLimit } = form.getFieldsValue();

    let errorCount = 0;

    // Transfers restricted
    // CHECK 1: singleLimit is a positive integer
    if (isValidInteger(singleLimit)) {
      setValidSingleLimit({ validateStatus: '', errorMsg: '' });
    } else {
      setValidSingleLimit({ validateStatus: 'error', errorMsg: LimitFormatTip });
      errorCount++;
    }
    // CHECK 2: dailyLimit is a positive integer
    if (isValidInteger(dailyLimit)) {
      setValidDailyLimit({ validateStatus: '', errorMsg: '' });
    } else {
      setValidDailyLimit({ validateStatus: 'error', errorMsg: LimitFormatTip });
      errorCount++;
    }
    // CHECK 3: dailyLimit >= singleLimit
    if (isValidInteger(singleLimit) && isValidInteger(dailyLimit)) {
      if (Number(dailyLimit) >= Number(singleLimit)) {
        setValidSingleLimit({ validateStatus: '', errorMsg: '' });
      } else {
        setValidSingleLimit({ validateStatus: 'error', errorMsg: SingleExceedDaily });
        errorCount++;
      }
    }
    return errorCount;
  }, [form]);
  const onSingleLimitChange = useCallback(() => {
    setValidSingleLimit({ validateStatus: '', errorMsg: '' });
  }, []);

  const onDailyLimitChange = useCallback(() => {
    setValidDailyLimit({ validateStatus: '', errorMsg: '' });
  }, []);

  const onFinish = useCallback(async () => {
    const errorCount = handleFormChange();
    if (errorCount > 0) return;
    const { singleLimit, dailyLimit } = form.getFieldsValue();
    await handleSetLimit({
      state,
      singleLimit,
      dailyLimit,
      restricted: restrictedText,
    });
    Modal.destroyAll();
  }, [form, handleFormChange, handleSetLimit, restrictedText, state]);

  return (
    <div className="transfer-settings-container">
      <div className="top-content">
        <div className="logo">
          <TokenImageDisplay src={state.imageUrl} diameter={80} />
        </div>
        <div className="token-name">{state.symbol}</div>
        <div className="chain-name">{chainName}</div>
        <div className="common-card">
          <div className="title title-container">
            <div>Transaction limits</div>
            <div>
              <Switch loading={switchLoading} onChange={handleRestrictedChange} checked={restrictedText} />
            </div>
          </div>
          <div className="sub-content">
            {restrictedText
              ? 'Transactions over the limit require you to modify the limit settings with guardian approval.'
              : 'No transaction limit.'}
          </div>
        </div>
        {restrictedText && (
          <div className="limit-container">
            <div className="common-card list-item">
              <div>Limit per transaction</div>
              <div className="content-highlight">{limitData?.singleLimit}</div>
            </div>
            <div className="common-card list-item">
              <div>Daily limit</div>
              <div className="content-highlight">{limitData?.dailyLimit}</div>
            </div>
          </div>
        )}
      </div>

      {restrictedText && (
        <div className="footer-btn-wrap">
          {/*<Button className="footer-btn" type="primary" onClick={onEdit}>page</Button>*/}
          <Button
            className="footer-btn"
            type="primary"
            onClick={() => {
              CustomModalBottom({
                isPrompt,
                type: 'confirm',
                noFooter: true,
                content: (
                  <TransferSettingsEditBody
                    form={form}
                    restrictedValue={restrictedText}
                    state={state}
                    disable={false}
                    validSingleLimit={validSingleLimit}
                    validDailyLimit={validDailyLimit}
                    onRestrictedChange={handleRestrictedChange}
                    onSingleLimitChange={onSingleLimitChange}
                    onDailyLimitChange={onDailyLimitChange}
                    onFinish={onFinish}
                  />
                ),
                onOk: () => {
                  return;
                },
                title: 'Edit transaction limits',
                okText: 'Save',
              });
            }}>
            {t('Edit')}
          </Button>
        </div>
      )}
    </div>
  );
}
