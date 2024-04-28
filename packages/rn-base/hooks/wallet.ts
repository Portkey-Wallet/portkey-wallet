import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { useCallback } from 'react';
import { useGetChainInfo } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useGetHolderInfoByViewContract } from './guardian';
import { useAppDispatch } from '../store-app/hooks';
import { updateCASyncState } from '@portkey-wallet/store/store-ca/wallet/actions';
import { getAllowance } from '@portkey-wallet/utils/contract';
import { getCurrentCaInfoByChainId, getViewTokenContractByChainId } from '../utils/redux';
import BigNumber from 'bignumber.js';
import { requestManagerApprove } from '../dapp/dappOverlay';
import { randomId, sleep } from '@portkey-wallet/utils';
import { ApproveMethod } from '@portkey-wallet/constants/constants-ca/dapp';
import { getGuardiansApprovedByApprove } from '../utils/guardian';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { USER_CANCELED } from '@portkey-wallet/constants/errorMessage';
import Loading from '@portkey-wallet/rn-components/components/Loading';

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
  caContract: ContractBasic;
  isShowOnceLoading?: boolean;
  alias?: string;
};
export const useCheckAllowanceAndApprove = () => {
  return useCallback(async (params: CheckAllowanceAndApproveParams) => {
    const { chainId, spender, symbol, bigAmount, decimals, alias, caContract, isShowOnceLoading } = params;
    const caInfo = getCurrentCaInfoByChainId(chainId);

    const tokenContract = await getViewTokenContractByChainId(chainId);

    let allowance: string;
    if (isShowOnceLoading) Loading.showOnce();
    const startTime = Date.now();
    try {
      allowance = await getAllowance(tokenContract, {
        owner: caInfo?.caAddress || '',
        spender,
        symbol,
      });
      const diffTime = Date.now() - startTime;
      if (diffTime < 500) {
        await sleep(500 - diffTime);
      }
    } catch (error) {
      throw error as any;
    }

    const eventName = randomId();
    if (bigAmount.gt(allowance)) {
      if (isShowOnceLoading) Loading.hide();
      const info = await requestManagerApprove(
        { origin: 'Crypto Box', name: 'Crypto Box', svgIcon: 'crypto-box-with-border' },
        {
          eventName,
          approveInfo: {
            symbol,
            amount: bigAmount.toString(),
            spender,
            decimals,
            targetChainId: chainId,
            alias,
          },
        },
      );
      if (!info) throw new Error(USER_CANCELED);
      const { guardiansApproved, approveInfo } = info;
      if (isShowOnceLoading) Loading.showOnce();
      try {
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
      } catch (error) {
        throw error as any;
      }
    }
    return true;
  }, []);
};
