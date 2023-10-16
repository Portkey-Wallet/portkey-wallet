import { useAppCASelector } from '.';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { WalletInfoType } from '@portkey-wallet/types/wallet';
import { CAInfoType } from '@portkey-wallet/types/types-ca/wallet';
import { WalletState } from '@portkey-wallet/store/store-ca/wallet/type';
import { useCurrentNetworkInfo } from './network';
import { useCurrentChain, useCurrentChainList } from './chainList';
import { request } from '@portkey-wallet/api/api-did';
import { useAppCommonDispatch } from '../index';
import { setWalletNameAction, setUserInfoAction } from '@portkey-wallet/store/store-ca/wallet/actions';
import { DeviceInfoType } from '@portkey-wallet/types/types-ca/device';
import { extraDataListDecode } from '@portkey-wallet/utils/device';
import { ChainId } from '@portkey-wallet/types';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { RequireAtLeastOne } from '@portkey-wallet/types/common';
import { getCAHolderManagerInfo } from '@portkey-wallet/graphql/contract/queries';
import { ManagerInfo, Maybe } from '@portkey-wallet/graphql/contract/__generated__/types';

export interface CurrentWalletType extends WalletInfoType, CAInfoType {
  caHash?: string;
  caAddressList?: string[];
}

export interface IDeviceItem {
  managerAddress: string | null | undefined;
  deviceInfo: DeviceInfoType;
  transactionTime: number;
  version: string;
}
export interface ICaAddressInfoListItemType {
  chainId: ChainId;
  chainName: string;
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

export const useCurrentCaHash = () => {
  const { caHash } = useCurrentWalletInfo();
  return useMemo(() => caHash, [caHash]);
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

interface IUseDeviceListConfig {
  isInit?: boolean;
  isAmountOnly?: boolean;
  onError?: (error: any) => void;
}
const defaultUseDeviceListConfig: IUseDeviceListConfig = {
  isInit: true,
  isAmountOnly: false,
};
export const useDeviceList = (config?: IUseDeviceListConfig) => {
  const { isInit, isAmountOnly, onError } = { ...defaultUseDeviceListConfig, ...config };

  const networkInfo = useCurrentNetworkInfo();
  const walletInfo = useCurrentWalletInfo();
  const originChainId = useOriginChainId();
  const chainInfo = useCurrentChain(originChainId);
  const [loading, setLoading] = useState(false);

  const [deviceList, setDeviceList] = useState<IDeviceItem[]>([]);
  const [deviceAmount, setDeviceAmount] = useState(0);

  const getDeviceList = useCallback(async (managerInfos: Array<Maybe<ManagerInfo>>) => {
    const extraDataStrList = managerInfos.map(item => item?.extraData || '');
    const extraDataList = await extraDataListDecode(extraDataStrList);
    const _deviceList = managerInfos
      .map((item, idx) => {
        return {
          ...extraDataList[idx],
          managerAddress: item?.address,
        };
      })
      .reverse();

    setDeviceList(_deviceList);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCAHolderManagerInfo(networkInfo.networkType, {
        dto: {
          chainId: chainInfo?.chainId,
          caHash: walletInfo.caHash,
          skipCount: 0,
          maxResultCount: 200,
        },
      });
      const { data } = result || {};

      if (!data || !data.caHolderManagerInfo || data.caHolderManagerInfo.length < 1) {
        throw new Error('no data');
      }
      const caHolderManagerInfo = data.caHolderManagerInfo[0];
      const managersInfos = caHolderManagerInfo?.managerInfos || [];

      setDeviceAmount(managersInfos.length);
      if (!isAmountOnly) {
        await getDeviceList(managersInfos);
      }
    } catch (error) {
      console.log('useDeviceList: error', error);
      setDeviceList([]);
      setDeviceAmount(0);
      onError?.(error);
    }
    setLoading(false);
  }, [chainInfo?.chainId, getDeviceList, isAmountOnly, networkInfo.networkType, onError, walletInfo.caHash]);

  // const [load, { data, error, loading }] = useCaHolderManagerInfoLazyQuery({
  //   client: getApolloClient(networkInfo.networkType),
  //   variables: {
  //     dto: {
  //       chainId: chainInfo?.chainId,
  //       caHash: walletInfo.caHash,
  //       skipCount: 0,
  //       maxResultCount: 100,
  //     },
  //   },
  //   fetchPolicy: 'no-cache',
  // });

  useEffect(() => {
    isInit && refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { refresh, deviceList, deviceAmount, loading };
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

export const useSetUserInfo = () => {
  const dispatch = useAppCommonDispatch();
  const networkInfo = useCurrentNetworkInfo();
  return useCallback(
    async (params: RequireAtLeastOne<{ nickName: string; avatar: string }>) => {
      await request.wallet.editHolderInfo({
        baseURL: networkInfo.apiUrl,
        params,
      });
      dispatch(setUserInfoAction(params));
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
