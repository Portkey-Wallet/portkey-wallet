import { WalletError } from '@portkey-wallet/store/wallet/type';
import { Form, FormProps } from 'antd';
import { FormItem } from 'components/BaseAntd';
import CustomPassword from 'components/CustomPassword';
import CustomSvg from 'components/CustomSvg';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import { useCallback, useState } from 'react';
import { setPasswordSeed } from 'store/reducers/user/slice';
import { useDispatch } from 'react-redux';
import './index.less';
import { useTranslation } from 'react-i18next';
import aes from '@portkey-wallet/utils/aes';
import { sleep } from '@portkey-wallet/utils';
import { getWalletsInfo } from 'utils/lib/SWGetReduxStore';
import singleMessage from 'utils/singleMessage';
import { useSetTokenConfig } from 'hooks/useSetTokenConfig';
import { useCommonState } from 'store/Provider/hooks';
import { CommonButton } from '@portkey/did-ui-react';
import clsx from 'clsx';

interface LockPageProps extends FormProps {
  onUnLockHandler?: (pwd: string) => void;
}

export default function LockPage({ onUnLockHandler, ...props }: LockPageProps) {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const setTokenConfig = useSetTokenConfig();
  const [form] = Form.useForm();
  const [isPassword, setIsPassword] = useState<-1 | 0 | 1>(-1);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = useCallback(
    async (values: any) => {
      setLoading(true);
      const { password } = values;
      setIsPassword(-1);
      const wallet = await getWalletsInfo();

      if (wallet.walletAddedCount <= 0) return singleMessage.error(WalletError.noCreateWallet);

      const unlockedData = aes.decrypt(
        wallet.walletList[0].AESEncryptMnemonic || wallet.walletList[0].accountList[0].AESEncryptPrivateKey,
        password,
      );
      if (unlockedData) {
        setIsPassword(1);
        dispatch(setPasswordSeed(password));
        await setTokenConfig(password);

        InternalMessage.payload(InternalMessageTypes.SET_SEED, password).send();
        await sleep(100);
        setLoading(false);
        onUnLockHandler?.(password);
      } else {
        setIsPassword(0);
      }
      setLoading(false);
    },
    [dispatch, onUnLockHandler, setTokenConfig],
  );

  return (
    <div className={clsx('lock-page-wrapper', isNotLessThan768 ? '' : 'lock-page-wrapper-popup')}>
      <div className={clsx('lock-page-content', isNotLessThan768 ? 'flex-column-center' : 'flex-column-between')}>
        <CustomSvg type="PortKeyPrompt" fillColor="#FFF" />
        <Form
          {...props}
          className="unlock-form"
          onValuesChange={(v) => {
            if ('password' in v) {
              if (!v.password) return setIsPassword(0);
              setIsPassword(-1);
            }
          }}
          form={form}
          name="unlock"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off">
          <FormItem
            className="customer-password"
            name="password"
            validateStatus={isPassword === 0 ? 'error' : undefined}
            help={isPassword === 0 ? t(`Incorrect PIN, please try again.`) : undefined}
            validateTrigger={false}>
            <CustomPassword autoFocus className="custom-password" placeholder={t('Enter Pin')} />
          </FormItem>

          <FormItem shouldUpdate className="customer-password-button">
            {() => (
              <CommonButton
                className="submit-btn"
                type="primary"
                block
                htmlType="submit"
                loading={loading}
                disabled={
                  // !form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length
                  !form.isFieldsTouched(true) || isPassword === 0
                }>
                {t('Unlock')}
              </CommonButton>
            )}
          </FormItem>
        </Form>
      </div>
    </div>
  );
}
