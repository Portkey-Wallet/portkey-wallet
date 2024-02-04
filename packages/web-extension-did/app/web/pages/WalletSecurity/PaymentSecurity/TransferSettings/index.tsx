import { useCommonState } from 'store/Provider/hooks';
import TransferSettingsPopup from './Popup';
import TransferSettingsPrompt from './Prompt';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useGetTransferLimitWithContract } from 'hooks/useSecurity';
import { Form } from 'antd';
import { useLocationState, useNavigateState } from 'hooks/router';
import { TTransferSettingEditLocationState, TTransferSettingLocationState } from 'types/router';

export default function TransferSettings() {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const { state } = useLocationState<TTransferSettingLocationState>();
  const [data, setData] = useState(state);
  const navigate = useNavigateState<TTransferSettingEditLocationState>();
  const headerTitle = t('Transfer Settings');
  const [form] = Form.useForm();
  const getTransferLimit = useGetTransferLimitWithContract(state?.targetChainId || state?.chainId);

  useEffectOnce(() => {
    getTransferLimit({ symbol: state?.symbol }).then((res) => {
      setData({ ...state, ...res });
    });
  });

  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security/payment-security');
  }, [navigate]);

  const onEdit = useCallback(() => {
    navigate('/setting/wallet-security/payment-security/transfer-settings-edit', { state: data });
  }, [data, navigate]);

  return isNotLessThan768 ? (
    <TransferSettingsPrompt headerTitle={headerTitle} goBack={handleBack} form={form} state={data} onEdit={onEdit} />
  ) : (
    <TransferSettingsPopup headerTitle={headerTitle} goBack={handleBack} form={form} state={data} onEdit={onEdit} />
  );
}
