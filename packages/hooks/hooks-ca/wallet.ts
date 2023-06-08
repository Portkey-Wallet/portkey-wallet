import { useAppCASelector } from '.';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { WalletInfoType } from '@portkey-wallet/types/wallet';
import { CAInfoType } from '@portkey-wallet/types/types-ca/wallet';
import { WalletState } from '@portkey-wallet/store/store-ca/wallet/type';
import { useCurrentNetworkInfo } from './network';
import { useCurrentChain, useCurrentChainList } from './chainList';
import { useCaHolderManagerInfoQuery } from '@portkey-wallet/graphql/contract/__generated__/hooks/caHolderManagerInfo';
import { getApolloClient } from '@portkey-wallet/graphql/contract/apollo';
import { request } from '@portkey-wallet/api/api-did';
import { useAppCommonDispatch } from '../index';
import { setWalletNameAction } from '@portkey-wallet/store/store-ca/wallet/actions';
import { DeviceInfoType } from '@portkey-wallet/types/types-ca/device';
import { extraDataListDecode } from '@portkey-wallet/utils/device';
import { ChainId } from '@portkey-wallet/types';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';

export interface CurrentWalletType extends WalletInfoType, CAInfoType {
  caHash?: string;
  caAddressList?: string[];
}

export interface IDeviceList {
  managerAddress: string | null | undefined;
  deviceInfo: DeviceInfoType;
  transactionTime: number;
  version: string;
}
export interface ICaAddressInfoListItemType {
  chainId: ChainId;
  caAddress: string;
}

function getCurrentWalletInfo(
  walletInfo: WalletState['walletInfo'],
  currentNetwork: WalletState['currentNetwork'],
  originChainId: ChainId,
): CurrentWalletType {
  const currentCAInfo = walletInfo?.caInfo?.[currentNetwork];

  const tmpWalletInfo: any = Object.assign({}, walletInfo, currentCAInfo, {
    caHash: currentCAInfo?.[originChainId]?.caHash,
    caAddressList: Object.values(currentCAInfo || {})
      ?.filter((info: any) => !!info?.caAddress)
      ?.map((i: any) => i?.caAddress),
  });

  if (tmpWalletInfo.caInfo) delete tmpWalletInfo.caInfo;

  return tmpWalletInfo;
}

export const useWallet = () => useAppCASelector(state => state.wallet);

export const useCurrentWalletInfo = () => {
  const { currentNetwork, walletInfo } = useWallet();
  const originChainId = useOriginChainId();

  return useMemo(() => {
    return getCurrentWalletInfo(walletInfo, currentNetwork, originChainId);
  }, [walletInfo, currentNetwork, originChainId]);
};

export const useCurrentWallet = () => {
  const wallet = useWallet();
  const originChainId = useOriginChainId();

  return useMemo(() => {
    const { walletInfo, currentNetwork, chainInfo } = wallet;
    return {
      ...wallet,
      walletInfo: getCurrentWalletInfo(walletInfo, currentNetwork, originChainId),
      chainList: chainInfo?.[currentNetwork],
    };
  }, [originChainId, wallet]);
};

export const useDeviceList = () => {
  const networkInfo = useCurrentNetworkInfo();
  const walletInfo = useCurrentWalletInfo();
  const originChainId = useOriginChainId();
  const chainInfo = useCurrentChain(originChainId);
  const { data, error, refetch, loading } = useCaHolderManagerInfoQuery({
    client: getApolloClient(networkInfo.networkType),
    variables: {
      dto: {
        chainId: chainInfo?.chainId,
        caHash: walletInfo.caHash,
        skipCount: 0,
        maxResultCount: 100,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const [deviceList, setDeviceList] = useState<IDeviceList[]>([]);
  const [deviceAmount, setDeviceAmount] = useState(0);
  const [decodeLoading, setDecodeLoading] = useState(false);

  const getDeviceList = useCallback(async () => {
    if (error || !data || !data.caHolderManagerInfo || data.caHolderManagerInfo.length < 1) {
      setDeviceList([]);
      setDeviceAmount(0);
      return;
    }

    const caHolderManagerInfo = data.caHolderManagerInfo[0];
    const managers = caHolderManagerInfo?.managerInfos || [];
    // console.log('managers===', managers);
    setDeviceAmount(managers.length);

    setDecodeLoading(true);
    const extraDataList = await extraDataListDecode(managers.map(item => item?.extraData || ''));
    const _deviceList = managers
      .map((item, idx) => {
        return {
          ...extraDataList[idx],
          managerAddress: item?.address,
        };
      })
      .reverse();

    setDeviceList(_deviceList);
    setDecodeLoading(false);
  }, [error, data]);

  useEffect(() => {
    getDeviceList();
  }, [getDeviceList]);

  return { deviceList, refetch, deviceAmount, loading: loading || decodeLoading };
};

export const useSetWalletName = () => {
  const dispatch = useAppCommonDispatch();
  const networkInfo = useCurrentNetworkInfo();
  return useCallback(
    async (nickName: string) => {
      await request.wallet.editWalletName({
        baseURL: networkInfo.apiUrl,
        params: {
          nickName,
        },
      });
      dispatch(setWalletNameAction(nickName));
    },
    [dispatch, networkInfo],
  );
};

export const useCaAddresses = () => {
  const { walletInfo, currentNetwork } = useWallet();
  const list = useChainIdList();
  const currentCAInfo = walletInfo?.caInfo?.[currentNetwork];

  return useMemo(
    () =>
      Object.entries(currentCAInfo || {})
        ?.filter((info: [string, any]) => list?.includes(info[0]) && !!info[1]?.caAddress)
        ?.map((i: [string, any]) => i[1].caAddress),
    [currentCAInfo, list],
  );
};

export const useCaAddressInfoList = (): ICaAddressInfoListItemType[] => {
  const { walletInfo, currentNetwork } = useWallet();
  const list = useChainIdList();
  const currentCAInfo = walletInfo?.caInfo?.[currentNetwork];

  return useMemo(
    () =>
      Object.entries(currentCAInfo || {})
        ?.filter((info: [string, any]) => list?.includes(info[0]) && !!info[1]?.caAddress)
        ?.map((i: [string, any]) => ({
          chainId: i[0],
          caAddress: i[1].caAddress,
        })),
    [currentCAInfo, list],
  ) as ICaAddressInfoListItemType[];
};

export const useChainIdList = () => {
  const { walletInfo, currentNetwork } = useWallet();
  const chainList = useCurrentChainList();

  return useMemo(() => {
    const currentCAInfo = walletInfo?.caInfo?.[currentNetwork];
    return Object.keys(currentCAInfo || {})?.filter(info => chainList?.some(chain => chain.chainId === info));
  }, [chainList, currentNetwork, walletInfo?.caInfo]);
};

export const useCaInfo = () => {
  return useWallet().chainInfo;
};

export const useCurrentCaInfo = () => {
  const { walletInfo, currentNetwork } = useWallet();
  return useMemo(() => walletInfo?.caInfo?.[currentNetwork], [walletInfo, currentNetwork]);
};

export const useOriginChainId = () => {
  const { originChainId } = useWallet();
  const caInfo = useCurrentCaInfo();
  return useMemo(
    () => caInfo?.originChainId || originChainId || DefaultChainId,
    [caInfo?.originChainId, originChainId],
  );
};

export const useOtherNetworkLogged = () => {
  const { walletInfo, currentNetwork } = useWallet();
  const { caInfo } = walletInfo || {};
  return useMemo(
    //  Are there any other networks logged into
    () => !!Object.keys(caInfo || {}).filter(key => key !== currentNetwork).length,
    [caInfo, currentNetwork],
  );
};
