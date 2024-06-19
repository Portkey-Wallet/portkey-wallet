import { useCrossTransferByEtransfer } from '@portkey-wallet/hooks/hooks-ca/useWithdrawByETransfer';
import { useCallback } from 'react';
import { usePin } from './store';
import { ChainId } from '@portkey-wallet/types';
import { useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { ZERO } from '@portkey-wallet/constants/misc';
import { divDecimals } from '@portkey-wallet/utils/converter';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useGetTokenViewContract } from './contract';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { IToSendAssetParamsType, TToInfo } from '@portkey-wallet/types/types-ca/routeParams';

export const useEtransferFee = (chainId: ChainId) => {
  const pin = usePin();
  const { etransfer: etransferFee } = useGetTxFee(chainId);
  const currentChain = useCurrentChain(chainId);

  const { withdrawPreview } = useCrossTransferByEtransfer(pin);
  const currentNetwork = useCurrentNetworkInfo();
  const getTokenViewContract = useGetTokenViewContract();
  const wallet = useCurrentWalletInfo();

  const getEtransferCAAllowance = useCallback(
    async (token: IToSendAssetParamsType) => {
      if (!currentChain) throw 'No currentChain';

      const tokenContract = await getTokenViewContract(chainId);
      const allowanceRes = await tokenContract.callViewMethod('GetAllowance', {
        symbol: token.symbol,
        owner: wallet[chainId]?.caAddress,
        spender: currentNetwork?.eTransferCA?.[token.chainId],
      });

      if (allowanceRes?.error) throw allowanceRes?.error;
      const allowance = divDecimals(allowanceRes.data.allowance ?? allowanceRes.data.amount ?? 0, token.decimals);
      return allowance;
    },
    [chainId, currentChain, currentNetwork?.eTransferCA, getTokenViewContract, wallet],
  );

  const getEtransferMaxFee = useCallback(
    // approve fee
    async ({ amount, toInfo, tokenInfo }: { amount: string; toInfo: TToInfo; tokenInfo: IToSendAssetParamsType }) => {
      const token = tokenInfo;
      try {
        const [{ withdrawInfo }, allowance] = await Promise.all([
          withdrawPreview({
            chainId: token.chainId,
            address: toInfo.address,
            symbol: token.symbol,
          }),
          getEtransferCAAllowance(tokenInfo),
        ]);

        console.log(withdrawInfo, allowance, 'checkEtransferMaxFee==');

        let _etransferFee = etransferFee;

        const isGTMax = withdrawInfo?.maxAmount ? ZERO.plus(amount).lte(withdrawInfo.maxAmount) : true;
        const isLTMin = withdrawInfo?.minAmount ? ZERO.plus(amount).gte(withdrawInfo.minAmount) : true;
        const amountAllowed = withdrawInfo ? isGTMax && isLTMin : false;

        if (amountAllowed && allowance.gte(amount)) _etransferFee = 0;
        console.log(_etransferFee, '_etransferFee==checkEtransferMaxFee');
        return _etransferFee.toString();
      } catch (error) {
        console.error('checkEtransferMaxFee:', error);
        return etransferFee.toString();
      }
    },
    [withdrawPreview, getEtransferCAAllowance, etransferFee],
  );

  return { getEtransferMaxFee };
};
