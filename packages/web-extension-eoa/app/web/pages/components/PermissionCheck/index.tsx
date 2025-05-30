import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import InternalMessage from 'messages/InternalMessage';
import { useDispatch } from 'react-redux';
import { setPasswordSeed } from 'store/reducers/user/slice';
import { useLocation, useNavigate } from 'react-router';
import { useAppDispatch, useWalletInfo } from 'store/Provider/hooks';
import { setIsPrompt } from 'store/reducers/common/slice';
import { useStorage } from 'hooks/useStorage';
import { sleep } from '@portkey-wallet/utils';
import { useIsNotLessThan768 } from 'hooks/useScreen';
import { useEffectOnce } from 'react-use';
// import OpenNewTabController from 'controllers/openNewTabController';
import { useOtherNetworkLogged } from '@portkey-wallet/hooks/hooks-ca/wallet';

const timeout = async () => {
  // TODO This is a bug
  await sleep(2000);
  return 'Chrome serviceworker is not working';
};

export default function PermissionCheck({
  children,
  pageType = 'Popup',
}: {
  children: ReactNode;
  pageType?: 'Popup' | 'Prompt';
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { walletInfo, currentNetwork } = useWalletInfo();
  // const networkList = useNetworkList();
  const location = useLocation();
  const otherNetworkLogged = useOtherNetworkLogged();

  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch(setIsPrompt(pageType === 'Prompt'));
  }, [appDispatch, pageType]);

  useIsNotLessThan768();

  // Check register on current network, if registered and current page is register page, redirect to home page

  const noCheckRegister = useMemo(
    () =>
      location.pathname.includes('/login') ||
      location.pathname.includes('/register') ||
      location.pathname.includes('/success-page') ||
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
      const res = await Promise.race([
        InternalMessage.payload(PortkeyMessageTypes.CHECK_WALLET_STATUS).send(),
        timeout(),
      ]);
      console.log(res, 'CHECK_WALLET_STATUS');
      if (typeof res === 'string') return chrome.runtime.reload();
      const detail = (res as any)?.data;
      if (detail?.registerStatus) {
        detail?.privateKey && dispatch(setPasswordSeed(detail.privateKey));
        // navigate to unlock except dapp connect
        location.pathname !== '/permission' && !detail?.privateKey && navigate('/unlock');
      } else {
        InternalMessage.payload(PortkeyMessageTypes.REGISTER_WALLET, {}).send();
      }
    } catch (error) {
      console.error(error, 'CHECK_WALLET_STATUS==error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getWalletStatus = useCallback(
    () => Promise.race([InternalMessage.payload(PortkeyMessageTypes.CHECK_WALLET_STATUS).send(), timeout()]),
    [],
  );

  const checkNeedUnlock = useCallback(
    async (checkOtherNetworkLogged = true) => {
      // Check: Chrome serviceworker is working
      const res = await getWalletStatus();
      if (typeof res === 'string') return chrome.runtime.reload();

      if (checkOtherNetworkLogged) {
        if (!otherNetworkLogged) return false;
      }

      const detail = (res as any)?.data;
      detail?.privateKey && dispatch(setPasswordSeed(detail.privateKey));
      if (detail.privateKey) return false;
      return true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getWalletStatus, otherNetworkLogged],
  );

  const checkCurrentNetworkRegisterHandler = useCallback(async () => {
    const caInfo = walletInfo?.caInfo?.[currentNetwork];
    const caHash = caInfo?.[caInfo?.originChainId || 'AELF']?.caHash;

    console.log(caInfo, 'caInfo===');
    // CurrentNetwork Register
    if (caHash) return getPassword();
    // CurrentNetwork not Register

    // Check other network is Resister
    const needPin = await checkNeedUnlock();
    if (needPin) return navigate('/unlock');
    if (pageType == 'Popup') {
      // await OpenNewTabController.closeOpenTabs();
      return InternalMessage.payload(PortkeyMessageTypes.REGISTER_WALLET, {}).send();
    } else {
      if (caInfo?.managerInfo) return navigate('/query-page');
      const isRegisterPage =
        location.pathname.includes('/login') ||
        location.pathname.includes('/register') ||
        location.pathname.includes('/success-page') ||
        location.pathname === '/query-page';
      if (isRegisterPage) return;
      return navigate('/register');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNetwork, getPassword, pageType, walletInfo?.caInfo]);

  useEffect(() => {
    if (location.pathname.includes('/test')) return;

    if (locked && !noCheckRegister && !isRegisterPage) {
      checkNeedUnlock(false).then((needUnlock) => {
        needUnlock && navigate('/unlock');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRegisterPage, locked, navigate, noCheckRegister]);

  useEffectOnce(() => {
    if (location.pathname.includes('/test')) return;
    checkCurrentNetworkRegisterHandler();
  });

  return <>{children}</>;
}
