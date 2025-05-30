import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Input } from 'antd';
import { FormItem } from 'components/BaseAntd';
import { useCurrentUserInfo, useSetUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import { useLoading } from 'store/Provider/hooks';
import './index.less';
import IdAndAddress from 'pages/Contacts/components/IdAndAddress';
import { IProfileDetailDataProps } from 'types/Profile';
import UploadAvatar from 'pages/components/UploadAvatar';
import uploadImageToS3 from 'utils/compressAndUploadToS3';
import { handleErrorMessage } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

export interface ISetWalletNameFormProps {
  data: IProfileDetailDataProps;
  saveCallback?: () => void;
}

export default function SetWalletNameForm({ data, saveCallback }: ISetWalletNameFormProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { avatar, nickName } = useCurrentUserInfo();
  const setUserInfo = useSetUserInfo();
  const [disable, setDisable] = useState<boolean>(false);
  const [validName, setValidName] = useState<{
    validateStatus?: ValidateStatus;
    errorMsg?: string;
  }>({
    validateStatus: '',
    errorMsg: '',
  });

  const [avatarDataUrl, setAvatarDataUrl] = useState(avatar);
  const newAvatarFile = useRef<File>();
  const { setLoading } = useLoading();

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
        setLoading(true);
        let s3Url = '';
        if (newAvatarFile.current) {
          s3Url = await uploadImageToS3(newAvatarFile.current);
        }

        await setUserInfo({ nickName: walletName, avatar: s3Url || avatar });
        saveCallback?.();
        singleMessage.success(t('Saved Successful'));
      } catch (error) {
        singleMessage.error(handleErrorMessage(error, 'set wallet name error'));
        console.log('setWalletName: error', error);
      } finally {
        setLoading(false);
      }
    },
    [avatar, saveCallback, setLoading, setUserInfo, t],
  );

  const getFile = useCallback((file: File) => {
    newAvatarFile.current = file;
  }, []);

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
    singleMessage.error('Something error');
  }, []);

  return (
    <Form
      form={form}
      className="set-wallet-name-form"
      colon={false}
      layout="vertical"
      initialValues={{ walletName: nickName }}
      onFinish={(v) => handleSave(v.walletName.trim())}
      onFinishFailed={onFinishFailed}>
      <div className="form-content-wrap">
        <div className="flex-center upload-avatar-wrapper">
          <UploadAvatar
            avatarUrl={avatarDataUrl}
            size="large"
            uploadText="Set New Photo"
            getTemporaryDataURL={setAvatarDataUrl}
            getFile={getFile}
          />
        </div>

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

        <IdAndAddress
          portkeyId={data?.caHolderInfo?.userId}
          relationId={data?.relationId}
          addresses={data?.addresses || []}
        />
      </div>
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
