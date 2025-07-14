import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import InternalMessage from 'messages/InternalMessage';
import { useDispatch } from 'react-redux';
import { setPasswordSeed } from 'store/reducers/user/slice';
import { useLocation, useNavigate } from 'react-router';
import { useAppDispatch, useWalletInfo } from 'store/Provider/hooks';
import { setIsPrompt } from 'store/reducers/common/slice';
import { useStorage } from 'hooks/useStorage';
import { useIsNotLessThan768 } from 'hooks/useScreen';
import { useEffectOnce } from 'react-use';

export default function PermissionCheck({
  children,
  pageType = 'Popup',
}: {
  children: ReactNode;
  pageType?: 'Popup' | 'Prompt';
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { walletAddedCount } = useWalletInfo();
  const location = useLocation();

  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch(setIsPrompt(pageType === 'Prompt'));
  }, [appDispatch, pageType]);

  useIsNotLessThan768();

  // Check register, if registered and current page is register page, redirect to home page

  const noCheckRegister = useMemo(
    () =>
      location.pathname.includes('/login') ||
      location.pathname.includes('/register') ||
      location.pathname.includes('/success-page') ||
      location.pathname.includes('/prepare-wallet') ||
      location.pathname.includes('/pin') ||
      location.pathname.includes('/wallet') ||
      location.pathname === '/permission',
    [location.pathname],
  );

  const isRegisterPage = useMemo(
    () =>
      location.pathname.includes('/register') ||
      location.pathname.includes('/success-page') ||
      ((location.pathname.includes('/query-page') || location.pathname.includes('/login')) && pageType === 'Popup'),
    [location.pathname, pageType],
  );

  const locked = useStorage<boolean>('locked');

  const getPassword = useCallback(async () => {
    try {
      const res = await InternalMessage.payload(PortkeyMessageTypes.GET_SEED).send();
      const detail = (res as any)?.data;

      if (detail?.privateKey) {
        dispatch(setPasswordSeed(detail.privateKey));
        return detail.privateKey;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error, 'GET_SEED==error');
      return false;
    }
  }, [dispatch]);

  const checkRegisterHandler = useCallback(async () => {
    console.log(walletAddedCount, 'walletAddedCount===');

    if (pageType === 'Prompt') {
      const isRegisterPage =
        location.pathname.includes('/login') ||
        location.pathname.includes('/register') ||
        location.pathname.includes('/success-page') ||
        location.pathname === '/query-page';
      if (isRegisterPage) return;
    }

    const password = await getPassword();
    if (walletAddedCount <= 0) {
      if (pageType === 'Prompt') {
        navigate('/register');
        return;
      }
      InternalMessage.payload(PortkeyMessageTypes.REGISTER_WALLET, {}).send();
    }
    if (!password) {
      navigate('/unlock');
    }
  }, [getPassword, location.pathname, navigate, pageType, walletAddedCount]);

  useEffect(() => {
    if (location.pathname.includes('/test')) return;

    if (locked && !noCheckRegister && !isRegisterPage) {
      getPassword().then((password) => {
        !password && navigate('/unlock');
      });
    }
  }, [getPassword, isRegisterPage, location.pathname, locked, navigate, noCheckRegister]);

  useEffectOnce(() => {
    if (location.pathname.includes('/test')) return;
    checkRegisterHandler();
  });

  return <>{children}</>;
}
