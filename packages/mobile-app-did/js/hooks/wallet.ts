import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { useCallback } from 'react';
import { useGetChainInfo } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useGetHolderInfoByViewContract } from './guardian';
import { useAppDispatch } from 'store/hooks';
import { updateCASyncState } from '@portkey-wallet/store/store-ca/wallet/actions';
import { getAllowance } from '@portkey-wallet/utils/contract';
import { getCurrentCaInfo, getViewTokenContractByChainId } from 'utils/redux';
import BigNumber from 'bignumber.js';
import { requestManagerApprove } from 'dapp/dappOverlay';
import { randomId } from '@portkey-wallet/utils';
import { useGetCAContract } from './contract';
import { ApproveMethod } from '@portkey-wallet/constants/constants-ca/dapp';
import { getGuardiansApprovedByApprove } from 'utils/guardian';

export const useCheckManagerSyncState = () => {
  const getHolderInfoByViewContract = useGetHolderInfoByViewContract();
  const getChainInfo = useGetChainInfo();
  const walletInfo = useCurrentWalletInfo();
  const dispatch = useAppDispatch();
  return useCallback(
    async (chainId: ChainId) => {
      try {
        const currentCaInfo = walletInfo?.[chainId];

        if (!currentCaInfo) return false;
        if (currentCaInfo?.isSync) return true;
        const chainInfo = await getChainInfo(chainId);
        const info = await getHolderInfoByViewContract({ caHash: currentCaInfo.caHash }, chainInfo);

        if (info.error) return false;

        const { managerInfos }: { managerInfos: { address: string }[] } = info.data;
        if (managerInfos.some(item => item.address === walletInfo.address)) {
          dispatch(updateCASyncState({ chainId }));
          return true;
        }

        return false;
      } catch (error) {
        return false;
      }
    },
    [dispatch, getChainInfo, getHolderInfoByViewContract, walletInfo],
  );
};

type CheckAllowanceAndApproveParams = {
  spender: string;
  chainId: ChainId;
  symbol: string;
  bigAmount: BigNumber;
  decimals: number;
};
export const useCheckAllowanceAndApprove = () => {
  const getCAContract = useGetCAContract();
  return useCallback(
    async (params: CheckAllowanceAndApproveParams) => {
      const { chainId, spender, symbol, bigAmount, decimals } = params;
      const caInfo = getCurrentCaInfo(chainId);

      const tokenContract = await getViewTokenContractByChainId(chainId);

      const allowance = await getAllowance(tokenContract, {
        owner: caInfo?.caAddress || '',
        spender,
        symbol,
      });
      const eventName = randomId();
      if (bigAmount.gt(allowance)) {
        const info = await requestManagerApprove(
          // TODO: origin, name;
          { origin: '', name: '' },
          {
            eventName,
            approveInfo: {
              symbol,
              amount: bigAmount.toString(),
              spender,
              decimals,
              targetChainId: chainId,
            },
          },
        );
        if (!info) throw new Error('User canceled');
        const caContract = await getCAContract(chainId);
        const { guardiansApproved, approveInfo } = info;
        const approveReq = await caContract.callSendMethod(ApproveMethod.ca, '', {
          caHash: caInfo?.caHash,
          spender: approveInfo.spender,
          symbol: approveInfo.symbol,
          amount: approveInfo.amount,
          guardiansApproved: getGuardiansApprovedByApprove(guardiansApproved),
        });
        if (approveReq?.error) throw approveReq?.error;
        if (approveReq?.data) {
          const confirmationAllowance = await getAllowance(tokenContract, {
            owner: caInfo?.caAddress || '',
            spender,
            symbol,
          });
          if (bigAmount.gt(confirmationAllowance)) throw new Error('Allowance Insufficient authorization');
        }
      }
      return true;
    },
    [getCAContract],
  );
};
