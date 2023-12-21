import { message } from 'antd';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'query-string';
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

export const useSetTransferLimit = (targetChainId?: ChainId) => {
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();

  const currentChain = useCurrentChain(targetChainId);
  const { state, search } = useLocation();
  const navigate = useNavigate();
  const currentNetwork = useCurrentNetworkInfo();
  const { userGuardianStatus } = useGuardiansInfo();
  const query = useMemo(() => {
    if (search) {
      const { detail } = qs.parse(search);
      return detail;
    } else {
      return state;
    }
  }, [search, state]);

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
      if (!currentChain?.endPoint || !privateKey) return message.error('set TransferLimit error');
      const { guardiansApproved } = formatGuardianValue(userGuardianStatus);
      const i = query.indexOf('_');
      const _query = query.substring(i + 1);
      const transQuery: ITransferLimitRouteState = JSON.parse(_query);
      const symbol = transQuery?.symbol;
      const dailyLimit = transQuery?.restricted ? transQuery.dailyLimit : '-1';
      const singleLimit = transQuery?.restricted ? transQuery.singleLimit : '-1';

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
            ...transQuery,
            dailyLimit: dailyLimit,
            singleLimit: singleLimit,
          });
        },
      });
    } catch (error) {
      setLoading(false);

      const _error = handleErrorMessage(error, 'Try again later');
      message.error(_error);
    }
  }, [
    checkBackPath,
    currentChain?.caContractAddress,
    currentChain?.endPoint,
    currentNetwork.walletType,
    query,
    setLoading,
    targetChainId,
    userGuardianStatus,
    walletInfo?.caHash,
  ]);
};
