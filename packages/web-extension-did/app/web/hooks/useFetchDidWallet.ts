import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useOriginChainId, useOtherNetworkLogged, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useFetchWalletCAAddress } from '@portkey-wallet/hooks/hooks-ca/wallet-result';
import { resetCaInfo, setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { resetWallet } from '@portkey-wallet/store/wallet/actions';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { PinErrorMessage } from '@portkey-wallet/utils/wallet/types';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch } from 'store/Provider/hooks';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import useDistributeLoginFail from './useDistributeLoginFail';
import googleAnalytics from 'utils/googleAnalytics';
import { LoginMethod } from '@portkey-wallet/types/types-ca/wallet';

export default function useFetchDidWallet() {
  const fetchWalletResult = useFetchWalletCAAddress();
  const dispatch = useAppDispatch();

  const originChainId = useOriginChainId();
  const currentChain = useCurrentChain(originChainId);
  const navigate = useNavigate();
  const { currentNetwork } = useWallet();
  const otherNetworkLogged = useOtherNetworkLogged();
  const distributeFail = useDistributeLoginFail();

  const fetch = useCallback(
    async ({
      pwd,
      clientId,
      requestId,
      managerAddress,
      verificationType,
      managerUniqueId,
    }: {
      pwd: string;
      clientId: string;
      requestId: string;
      managerAddress: string;
      managerUniqueId: string;
      verificationType: VerificationType;
    }) => {
      console.log(currentChain, 'walletResult===currentChain');

      if (!currentChain) throw 'Could not find chain information';
      const walletResult = await fetchWalletResult({
        clientId,
        requestId,
        verificationType,
        managerUniqueId,
      });
      try {
        walletResult.Socket.stop();
      } catch (error) {
        //
      }
      console.log(walletResult, 'walletResult===');
      if (walletResult.status !== 'pass') {
        const errorString = walletResult?.message || walletResult.status;
        if (errorString?.includes('ManagerInfo exists')) {
          try {
            const isSuccess = await distributeFail({
              messageStr: errorString,
              managerAddress,
              currentNetwork,
              pin: pwd,
              verificationType,
            });
            if (isSuccess) return;
          } catch (error) {
            //
          }
        }
        if (otherNetworkLogged) {
          dispatch(resetCaInfo(currentNetwork));
        } else {
          dispatch(resetWallet());
        }
        throw (errorString as string) || 'Something error';
      } else {
        if (!pwd) throw PinErrorMessage.invalidPin;
        try {
          const result = await getHolderInfo({
            chainId: originChainId,
            caHash: walletResult.caHash,
          });

          console.log(result, 'result===');

          const managerList: any[] = result.managerInfos;

          if (!managerList.find((info) => info?.address === managerAddress)) throw `${managerAddress} is not a manager`;

          dispatch(
            setCAInfo({
              caInfo: {
                caAddress: walletResult.caAddress,
                caHash: walletResult.caHash,
              },
              pin: pwd,
              chainId: originChainId,
            }),
          );

          const path = VerificationType.register === verificationType ? 'register' : 'login';

          googleAnalytics.loginEndEvent(
            VerificationType.register === verificationType ? LoginMethod.Signup : LoginMethod.SocialRecovery,
          );

          navigate(`/success-page/${path}`);
        } catch (error: any) {
          throw handleErrorMessage(error);
        }
      }
    },
    [
      currentChain,
      currentNetwork,
      dispatch,
      distributeFail,
      fetchWalletResult,
      navigate,
      originChainId,
      otherNetworkLogged,
    ],
  );
  return fetch;
}
