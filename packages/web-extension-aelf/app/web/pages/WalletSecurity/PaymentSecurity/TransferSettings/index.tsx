import TransferSettingsPopup from './Popup';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useGetTransferLimitWithContract } from 'hooks/useSecurity';
import { Form } from 'antd';
import { useLocationState, useNavigateState } from 'hooks/router';
import { TTransferSettingEditLocationState, TTransferSettingLocationState } from 'types/router';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

export default function TransferSettings() {
  const { t } = useTranslation();
  const { state } = useLocationState<TTransferSettingLocationState>();
  const [data, setData] = useState(state);
  const navigate = useNavigateState<TTransferSettingEditLocationState>();
  const headerTitle = t('Transaction Limits');
  const [form] = Form.useForm();
  const getTransferLimit = useGetTransferLimitWithContract(state?.targetChainId || state?.chainId);
  const isMainnet = useIsMainnet();

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

  return (
    <TransferSettingsPopup
      headerTitle={headerTitle}
      goBack={handleBack}
      form={form}
      state={data}
      onEdit={onEdit}
      chainName={transNetworkText(state?.targetChainId || state?.chainId, !isMainnet)}
    />
  );
}
