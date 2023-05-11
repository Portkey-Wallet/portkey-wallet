import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { NetworkType } from '@portkey-wallet/types';
import { BaseHeaderProps } from 'types/UI';
import SwitchNetworkPrompt from './Prompt';
import SwitchNetworkPopup from './Popup';
import { useCommonState } from 'store/Provider/hooks';

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
  const { isNotLessThan768 } = useCommonState();
  const title = t('Switch Networks');
  const goBack = useCallback(() => navigate('/setting/wallet'), [navigate]);

  return isNotLessThan768 ? (
    <SwitchNetworkPrompt headerTitle={title} goBack={goBack} />
  ) : (
    <SwitchNetworkPopup headerTitle={title} goBack={goBack} />
  );
}
