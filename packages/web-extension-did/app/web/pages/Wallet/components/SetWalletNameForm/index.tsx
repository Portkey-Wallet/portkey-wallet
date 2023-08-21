import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Input, message } from 'antd';
import { FormItem } from 'components/BaseAntd';
import { useSetWalletName } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import { useWalletInfo } from 'store/Provider/hooks';
import './index.less';
import IdAndAddress from 'pages/Contacts/components/IdAndAddress';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

// TODO any
export default function SetWalletNameForm({ data, handleCopy, saveCallback }: any) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const isMainNet = useIsMainnet();
  const { walletName } = useWalletInfo();
  const setWalletName = useSetWalletName();
  const [disable, setDisable] = useState<boolean>(false);
  const [validName, setValidName] = useState<{
    validateStatus?: ValidateStatus;
    errorMsg?: string;
  }>({
    validateStatus: '',
    errorMsg: '',
  });

  const handleInputChange = useCallback((value: string) => {
    setValidName({
      validateStatus: '',
      errorMsg: '',
    });
    if (!value) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, []);

  const handleUpdateName = useCallback(
    async (walletName: string) => {
      try {
        await setWalletName(walletName);
        saveCallback();
        message.success(t('Saved Successful'));
      } catch (error) {
        message.error('set wallet name error');
        console.log('setWalletName: error', error);
      }
    },
    [saveCallback, setWalletName, t],
  );

  const handleSave = useCallback(
    (walletName: string) => {
      if (!walletName) {
        setValidName({
          validateStatus: 'error',
          errorMsg: 'Please Enter Wallet Name',
        });
        form.setFieldValue('walletName', '');
        setDisable(true);
      } else if (!isValidCAWalletName(walletName)) {
        setValidName({
          validateStatus: 'error',
          errorMsg: '3-16 characters, only a-z, A-Z, 0-9, space and "_" allowed',
        });
        setDisable(true);
      } else {
        handleUpdateName(walletName);
      }
    },
    [form, handleUpdateName],
  );

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.error(errorInfo, 'onFinishFailed==');
    message.error('Something error');
  }, []);

  return (
    <Form
      form={form}
      className="set-wallet-name-form"
      colon={false}
      layout="vertical"
      initialValues={{ walletName: walletName }}
      onFinish={(v) => handleSave(v.walletName.trim())}
      onFinishFailed={onFinishFailed}>
      <div className="form-content">
        <FormItem
          name="walletName"
          label="Wallet Name"
          validateStatus={validName.validateStatus}
          help={validName.errorMsg}
          validateTrigger="onBlur">
          <Input
            autoComplete="off"
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t('Enter Waller Name')}
            maxLength={16}
          />
        </FormItem>
      </div>

      {isMainNet && (
        <IdAndAddress
          portkeyId={data?.userId}
          relationId={data?.relationId}
          addresses={data?.addresses || []}
          handleCopy={handleCopy}
        />
      )}

      <div className="form-btn">
        <FormItem>
          <Button type="primary" htmlType="submit" disabled={disable}>
            {t('Save')}
          </Button>
        </FormItem>
      </div>
    </Form>
  );
}
