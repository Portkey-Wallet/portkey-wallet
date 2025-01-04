import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Input } from 'antd';
import { FormItem } from 'components/BaseAntd';
import { RequireAtLeastOne } from '@portkey-wallet/types/common';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import './index.less';
import { IProfileDetailDataProps } from 'types/Profile';
import { handleErrorMessage } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

export interface ISetWalletNameFormProps {
  data: IProfileDetailDataProps;
  saveCallback?: () => void;
  nickName?: string;
  setUserInfo: (params: RequireAtLeastOne<{ nickName: string; avatar: string }>) => Promise<void>;
}

export default function EditWalletNameForm({ saveCallback, nickName, setUserInfo }: ISetWalletNameFormProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [disable, setDisable] = useState<boolean>(false);
  const [validName, setValidName] = useState<{
    validateStatus?: ValidateStatus;
    errorMsg?: string;
    length?: number;
  }>({
    validateStatus: '',
    errorMsg: '',
    length: nickName?.length || 0,
  });

  const [loading, setLoading] = useState(false);

  const walletNameCheck = useCallback(
    (walletName: string) => {
      if (!walletName) {
        setValidName({
          validateStatus: 'error',
          errorMsg: 'Please Enter Wallet Name',
          length: 0,
        });
        form.setFieldValue('walletName', '');
        setDisable(true);
        return false;
      } else if (!isValidCAWalletName(walletName)) {
        setValidName({
          validateStatus: 'error',
          errorMsg: '3-16 characters, only a-z, A-Z, 0-9, space and "_" allowed',
          length: walletName.length,
        });
        setDisable(true);
        return false;
      }
      return true;
    },
    [form],
  );

  const handleInputChange = useCallback(
    (value: string) => {
      const valid = walletNameCheck(value);
      if (!valid) {
        return;
      }
      setValidName({
        validateStatus: '',
        errorMsg: '',
        length: value.length,
      });
      setDisable(false);
    },
    [walletNameCheck],
  );

  const handleUpdateName = useCallback(
    async (walletName: string) => {
      try {
        setLoading(true);
        await setUserInfo({ nickName: walletName });
        saveCallback?.();
        singleMessage.success(t('Saved Successful'));
      } catch (error) {
        singleMessage.error(handleErrorMessage(error, 'set wallet name error'));
        console.log('setWalletName: error', error);
      } finally {
        setLoading(false);
      }
    },
    [saveCallback, setLoading, setUserInfo, t],
  );

  const handleSave = useCallback(
    (walletName: string) => {
      const valid = walletNameCheck(walletName);
      if (!valid) {
        return;
      }
      handleUpdateName(walletName);
    },
    [handleUpdateName, walletNameCheck],
  );

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.error(errorInfo, 'onFinishFailed==');
    singleMessage.error('Something error');
  }, []);

  return (
    <Form
      form={form}
      className="edit-wallet-name-form customer-form"
      colon={false}
      layout="vertical"
      initialValues={{ walletName: nickName }}
      onFinish={(v) => handleSave(v.walletName.trim())}
      onFinishFailed={onFinishFailed}>
      <div className="form-content-wrap">
        <div className="form-content">
          <FormItem
            name="walletName"
            // label="Wallet Name"
            validateStatus={validName.validateStatus || 'validating'}
            help={validName.errorMsg || `${validName.length}/16`}
            validateTrigger="onBlur">
            <Input
              allowClear
              autoComplete="off"
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={t('Only a-z, A-Z, 0-9, space and "_" allowed')}
              maxLength={16}
            />
          </FormItem>
        </div>
      </div>
      <div className="form-btn">
        <FormItem>
          <Button type="primary" htmlType="submit" disabled={disable} loading={loading}>
            {t('Save')}
          </Button>
        </FormItem>
      </div>
    </Form>
  );
}
