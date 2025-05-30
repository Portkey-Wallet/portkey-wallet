import { useCallback, useEffect } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import AllowanceDetailPrompt from './Prompt';
import AllowanceDetailPopup from './Popup';
import { useLocationState, useNavigateState } from 'hooks/router';
import { ITokenAllowance } from '@portkey-wallet/types/types-ca/allowance';

export default function TokenAllowanceDetail() {
  const navigate = useNavigateState();
  const { state } = useLocationState<ITokenAllowance>();
  const { isNotLessThan768 } = useCommonState();

  const title = 'Token Allowance';
  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security/token-allowance');
  }, [navigate]);

  useEffect(() => {
    if (!state) handleBack();
  }, [handleBack, state]);

  return isNotLessThan768 ? (
    <AllowanceDetailPrompt headerTitle={title} goBack={handleBack} allowanceDetail={state} />
  ) : (
    <AllowanceDetailPopup headerTitle={title} goBack={handleBack} allowanceDetail={state} />
  );
}
