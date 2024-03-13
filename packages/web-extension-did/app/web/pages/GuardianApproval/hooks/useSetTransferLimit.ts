import { useCallback } from 'react';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import { formatGuardianValue } from '../utils/formatGuardianValue';
import { setTransferLimit } from 'utils/sandboxUtil/setTransferLimit';
import ModalTip from 'pages/components/ModalTip';
import { handleErrorMessage, sleep } from '@portkey-wallet/utils';
import { ICheckLimitBusiness, ITransferLimitRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { ChainId } from '@portkey-wallet/types';
import getSeed from 'utils/getSeed';
import singleMessage from 'utils/singleMessage';
import { usePromptLocationParams, useNavigateState } from 'hooks/router';
import {
  TRampLocationState,
  TSendLocationState,
  TSetTransferLimitLocationSearch,
  TSetTransferLimitLocationState,
  TTransferSettingLocationState,
} from 'types/router';

export const useSetTransferLimit = (targetChainId?: ChainId) => {
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();

  const currentChain = useCurrentChain(targetChainId);
  const { locationParams } = usePromptLocationParams<TSetTransferLimitLocationState, TSetTransferLimitLocationSearch>();
  const navigate = useNavigateState<TTransferSettingLocationState | TSendLocationState | TRampLocationState>();
  const currentNetwork = useCurrentNetworkInfo();
  const { userGuardianStatus } = useGuardiansInfo();

  const checkBackPath = useCallback(
    (state: ITransferLimitRouteState) => {
      switch (state.from) {
        case ICheckLimitBusiness.RAMP_SELL:
          navigate('/buy', { state: { ...state, ...state.extra } });
          break;
        case ICheckLimitBusiness.SEND:
          navigate(`/send/token/${state.symbol}`, { state: { ...state, ...state.extra } });
          break;

        default:
          navigate('/setting/wallet-security/payment-security/transfer-settings', { state });
          break;
      }
      return;
    },
    [navigate],
  );

  return useCallback(async () => {
    try {
      if (!targetChainId) throw Error('No chainId');

      setLoading(true);
      const { privateKey } = await getSeed();
      if (!currentChain?.endPoint || !privateKey) return singleMessage.error('set TransferLimit error');
      const { guardiansApproved } = formatGuardianValue(userGuardianStatus);
      const symbol = locationParams?.symbol;
      const dailyLimit = locationParams?.restricted ? locationParams.dailyLimit : '-1';
      const singleLimit = locationParams?.restricted ? locationParams.singleLimit : '-1';

      await setTransferLimit({
        rpcUrl: currentChain.endPoint,
        chainType: currentNetwork.walletType,
        address: currentChain.caContractAddress,
        privateKey,
        paramsOption: {
          caHash: walletInfo?.caHash as string,
          symbol,
          dailyLimit,
          singleLimit,
          guardiansApproved,
        },
      });

      setLoading(false);
      ModalTip({
        content: 'Requested successfully',
        onClose: async () => {
          await sleep(1000);
          checkBackPath({
            ...locationParams.initStateBackUp,
            ...locationParams,
            dailyLimit: dailyLimit,
            singleLimit: singleLimit,
          });
        },
      });
    } catch (error) {
      setLoading(false);

      const _error = handleErrorMessage(error, 'Try again later');
      singleMessage.error(_error);
    }
  }, [
    checkBackPath,
    currentChain,
    currentNetwork.walletType,
    locationParams,
    setLoading,
    targetChainId,
    userGuardianStatus,
    walletInfo?.caHash,
  ]);
};
