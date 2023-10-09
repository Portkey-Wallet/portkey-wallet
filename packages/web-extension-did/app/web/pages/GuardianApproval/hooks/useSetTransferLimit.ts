import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'query-string';
import aes from '@portkey-wallet/utils/aes';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useAssetInfo, useGuardiansInfo, useLoading, useUserInfo } from 'store/Provider/hooks';
import { contractErrorHandler } from 'utils/tryErrorHandler';
import { formatGuardianValue } from '../utils/formatGuardianValue';
import { setTransferLimit } from 'utils/sandboxUtil/setTransferLimit';
import ModalTip from 'pages/components/ModalTip';
import { sleep } from '@portkey-wallet/utils';
import { ICheckLimitBusiness, ITransferLimitRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { ChainId } from '@portkey-wallet/types';

export const useSetTransferLimit = (targetChainId?: ChainId) => {
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const { passwordSeed } = useUserInfo();
  const {
    accountAssets: { accountAssetsList },
  } = useAssetInfo();

  const currentChain = useCurrentChain(targetChainId);
  const { state, search } = useLocation();
  const navigate = useNavigate();
  const currentNetwork = useCurrentNetworkInfo();
  const { userGuardianStatus } = useGuardiansInfo();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (search) {
      const { detail } = qs.parse(search);
      setQuery(detail);
    } else {
      setQuery(state);
    }
  }, [query, search, state]);

  const checkBackPath = useCallback(
    (state: ITransferLimitRouteState) => {
      const chainId = state.targetChainId || state.chainId;
      const sendStateArr = accountAssetsList?.filter((item) => {
        return item.chainId === chainId && item.symbol === state.symbol;
      });
      const sendState = {
        chainId: chainId,
        decimals: state.decimals,
        address: sendStateArr[0]?.tokenInfo?.tokenContractAddress,
        symbol: state.symbol,
        name: state.symbol,
      };

      switch (state.from) {
        case ICheckLimitBusiness.RAMP_SELL:
          navigate('/buy');
          break;

        case ICheckLimitBusiness.SEND:
          navigate(`/send/token/${state.symbol}`, { state: sendState });
          break;

        default:
          navigate('/setting/wallet-security/payment-security/transfer-settings', { state });
          break;
      }
      return;
    },
    [accountAssetsList, navigate],
  );

  return useCallback(async () => {
    try {
      if (!targetChainId) throw Error('No chainId');

      setLoading(true);

      const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, passwordSeed);
      if (!currentChain?.endPoint || !privateKey) return message.error('remove manage error');
      const { guardiansApproved } = formatGuardianValue(userGuardianStatus);
      const transQuery: ITransferLimitRouteState = JSON.parse(query.split('_')[1]);
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
          checkBackPath({ ...transQuery, dailyLimit: dailyLimit, singleLimit: singleLimit });
        },
      });
    } catch (error) {
      setLoading(false);

      const _error = contractErrorHandler(error) || 'Try again later';
      message.error(_error);
    }
  }, [
    checkBackPath,
    currentChain?.caContractAddress,
    currentChain?.endPoint,
    currentNetwork.walletType,
    passwordSeed,
    query,
    setLoading,
    targetChainId,
    userGuardianStatus,
    walletInfo.AESEncryptPrivateKey,
    walletInfo?.caHash,
  ]);
};
