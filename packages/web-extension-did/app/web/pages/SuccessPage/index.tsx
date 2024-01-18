import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { usePreventHardwareBack } from 'hooks/useHardwareBack';
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import { useEffectOnce } from 'react-use';
import { useAppDispatch } from 'store/Provider/hooks';
import { resetLoginInfoAction } from 'store/reducers/loginCache/actions';
import { SuccessPageType } from 'types/UI';
import SuccessPageUI from './SuccessPageUI';
import { useNavigateState } from 'hooks/router';

export default function SuccessPage() {
  const { type: state } = useParams<{ type: 'login' | 'scan' | 'register' }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigateState();
  const wallet = useCurrentWallet();
  console.log(wallet, 'wallet===');
  const type = useMemo(() => {
    switch (state) {
      case 'register':
        return SuccessPageType.Created;
      case 'login':
      default:
        return SuccessPageType.Login;
    }
  }, [state]);

  const onConfirm = useCallback(() => navigate('/'), [navigate]);

  usePreventHardwareBack();

  useEffectOnce(() => {
    dispatch(resetLoginInfoAction());
  });

  return <SuccessPageUI type={type} onConfirm={onConfirm} />;
}
