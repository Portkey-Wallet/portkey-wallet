import { useCallback } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
import WalletNamePopup from './Popup';
import WalletNamePrompt from './Prompt';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';

export default function WalletName() {
  const { isNotLessThan768 } = useCommonState();
  const navigate = useNavigate();
  const { walletName } = useWalletInfo();

  const goBack = useCallback(() => navigate('/setting/wallet'), [navigate]);

  return isNotLessThan768 ? (
    <WalletNamePrompt headerTitle={walletName} goBack={goBack} />
  ) : (
    <WalletNamePopup headerTitle={walletName} goBack={goBack} />
  );
}
