import { useCallback, useEffect } from 'react';
import AllowanceDetailPopup from './Popup';
import { useLocationState, useNavigateState } from 'hooks/router';
import { ITokenAllowance } from '@portkey-wallet/types/types-ca/allowance';

export default function TokenAllowanceDetail() {
  const navigate = useNavigateState();
  const { state } = useLocationState<ITokenAllowance>();

  const title = 'Token Allowance';
  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security/token-allowance');
  }, [navigate]);

  useEffect(() => {
    if (!state) handleBack();
  }, [handleBack, state]);

  return <AllowanceDetailPopup headerTitle={title} goBack={handleBack} allowanceDetail={state} />;
}
