import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { NetworkType } from '@portkey-wallet/types';
import { BaseHeaderProps } from 'types/UI';
import SwitchNetworkPopup from './Popup';

export interface Network {
  key: string;
  name: string;
  walletType: string;
  networkType: NetworkType;
  disabled: boolean;
  icon: string;
}

export type ISwitchNetworkProps = BaseHeaderProps;

export default function SwitchNetwork() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const title = t('Switch Network');
  const goBack = useCallback(() => navigate('/setting'), [navigate]);

  return <SwitchNetworkPopup headerTitle={title} goBack={goBack} />;
}
